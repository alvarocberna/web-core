import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { ImageStorageDatasource, ImageEntityType } from 'src/domain';
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AwsStorageDatasourceService implements ImageStorageDatasource{
    //definimos propiedades internas
    private s3: S3Client;
    private bucketName: string;
    private region: string;
    private publicBaseUrl: string;

    //inyectamos instancia de la dependencia ConfigService
    constructor(
        @Inject(ConfigService)
        private configService: ConfigService, 
        @Inject(PrismaService)
        private readonly prismaService: PrismaService
    ) {
        //inicializamos propiedades internas
        this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || '';

        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET no está configurado');
        }

        //configuramos el clienteo o usuario que nos proporciona AWS que consumirá el bucket
        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });

        this.publicBaseUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
    }

    async saveImage(file: any): Promise<string> {
        try {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname || '');
            const filename = `image-${uniqueSuffix}${ext}`;
            const key = `uploads/images/${filename}`;

            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype || 'application/octet-stream',
                })
            );

            return `${this.publicBaseUrl}/${key}`;
        } catch (error) {
            throw new InternalServerErrorException('Error al subir la imagen a S3');
        }
    }

    private async deleteS3Url(imageUrl: string | null | undefined): Promise<void> {
        if (!imageUrl) return;
        try {
            const url = new URL(imageUrl);
            const key = url.pathname.replace(/^\//, '');
            if (!key) return;
            await this.s3.send(
                new DeleteObjectCommand({ Bucket: this.bucketName, Key: key })
            );
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la imagen en S3');
        }
    }

    async deleteImage(id_proyecto: string, id_entidad: string, entityType: ImageEntityType): Promise<void> {

        if (entityType === 'articulo') {
            const articulo = await this.prismaService.articulo.findUnique({
                where: { id: id_entidad, proyecto_id: id_proyecto },
                include: { sec_articulo: true },
            });
            if (!articulo) throw new NotFoundException('Articulo no encontrado');

            await this.deleteS3Url(articulo.image_url);
            await Promise.all(articulo.sec_articulo.map(s => this.deleteS3Url(s.image_url)));

        } else if (entityType === 'servicio') {
            const servicio = await this.prismaService.servicio.findUnique({
                where: { id: id_entidad },
                include: { sec_servicio: true },
            });
            if (!servicio) throw new NotFoundException('Servicio no encontrado');

            await this.deleteS3Url(servicio.img_url);
            await Promise.all(servicio.sec_servicio.map(s => this.deleteS3Url(s.image_url)));

        } else if (entityType === 'empleado') {
            const empleado = await this.prismaService.empleado.findUnique({
                where: { id: id_entidad },
                include: { sec_empleado: true },
            });
            if (!empleado) throw new NotFoundException('Empleado no encontrado');

            await this.deleteS3Url(empleado.img_url);
            await Promise.all(empleado.sec_empleado.map(s => this.deleteS3Url(s.image_url)));
        }
    }
}
