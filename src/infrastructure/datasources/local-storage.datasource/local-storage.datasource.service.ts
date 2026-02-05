import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { FileFilterCallback } from 'multer';
import { ImageStorageDatasource } from 'src/domain';
import { PrismaService } from 'src/infrastructure/orm/prisma/prisma.service';

@Injectable()
export class LocalStorageDatasourceService {
    //definimos propiedades internas
    private uploadDir: string;
    private baseUrl: string;

    //inyectamos instancia de la dependencia ConfigService
    constructor(private configService: ConfigService, private readonly prismaService: PrismaService ) {
        //inicializamos propiedades internas
        this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
        this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
        
        // Crear directorio si no existe
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    saveImage(file: any): string {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const filename = `image-${uniqueSuffix}${ext}`;
        const filePath = path.join(this.uploadDir, filename);
        
        fs.writeFileSync(filePath, file.buffer);
        
        return `${this.baseUrl}/uploads/images/${filename}`;
    }

    async deleteImage(id_usuario: string, id_articulo: string): Promise<void> {

        const articulo = await this.prismaService.articulo.findUnique({
            where: {
                id: id_articulo,
                autor_id: id_usuario,
            },
            include: {
                sec_articulo: true,
            }   
        })
        if(!articulo){
            throw new NotFoundException("Usuario no encontrado")
        }

        // if (!imageUrl || !imageUrl.includes('/uploads/images/')) return;

        //eliminamos imagen de articulo
        const imageUrl = articulo.image_url;
        if(imageUrl){
            try {             
                const filename = path.basename(imageUrl);
                const filePath = path.join(this.uploadDir, filename);
                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                throw new InternalServerErrorException('Error al eliminar la imagen en local');
            }
        }

        //eliminamos imagenes de las secciones
        articulo.sec_articulo.forEach(async (sec_articulo) => {
            const imageUrl = sec_articulo.image_url;
            if(imageUrl){
                try {
                    const filename = path.basename(imageUrl);
                    const filePath = path.join(this.uploadDir, filename);
                    
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (error) {
                    throw new InternalServerErrorException('Error al eliminar la imagen en S3');
                }
            }
        })
        
    }
}
