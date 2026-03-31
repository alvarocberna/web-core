import { Controller, Req, Get, Post, Body, Put, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { imageMulterOptions } from '../../common/utils/multer.config';
import { ArticuloService } from './articulo.service';
import { CreateArticulosDtoImpl } from './dto/create-articulos.dto';
import { UpdateArticulosDtoImpl } from './dto/update-articulos.dto';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('articulos')
@Controller('articulos')
export class ArticuloController {
    constructor(private readonly articuloService: ArticuloService) {}

    // ─── Articulos (entidad padre) ────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear la sección de artículos' })
    @ApiResponse({ status: 201, description: 'Sección artículos creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/crear')
    createArticulos(
        @Req() req: Request,
        @Body() createArticulosDto: CreateArticulosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.articuloService.createArticulos(id_usuario, createArticulosDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener la sección de artículos con todos sus artículos y secciones' })
    @ApiResponse({ status: 200, description: 'Sección artículos con artículos y sec_artículos' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/ver-todo')
    findArticulos(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.articuloService.findArticulos(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar la sección de artículos' })
    @ApiResponse({ status: 200, description: 'Sección artículos actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('/editar')
    updateArticulos(
        @Req() req: Request,
        @Body() updateArticulosDto: UpdateArticulosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.articuloService.updateArticulos(id_usuario, updateArticulosDto);
    }

    // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear artículo con imágenes (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    description: 'JSON stringificado con los datos del artículo (CreateArticuloDtoImpl)',
                    example: '{"titulo":"Mi artículo","subtitulo":"..."}',
                },
                image_file: { type: 'string', format: 'binary', description: 'Imagen principal del artículo' },
                sec_images: { type: 'string', format: 'binary', description: 'Imágenes de las secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 201, description: 'Artículo creado exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/articulo/crear')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    createArticulo(
        @Req() req: Request,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) {
            throw new BadRequestException('El campo "data" es requerido en el FormData');
        }
        let createArticuloDtoImpl: CreateArticuloDtoImpl;
        try {
            createArticuloDtoImpl = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        return this.articuloService.createArticulo(id_usuario, createArticuloDtoImpl, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener un artículo por ID' })
    @ApiParam({ name: 'id_articulo', description: 'ID del artículo' })
    @ApiResponse({ status: 200, description: 'Artículo encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/articulo/ver/:id_articulo')
    findArticuloById(
        @Req() req: Request,
        @Param('id_articulo') id_articulo: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.articuloService.findArticuloById(id_usuario, id_articulo);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar artículo con imágenes (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id_articulo', description: 'ID del artículo a editar' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    description: 'JSON stringificado con los datos a actualizar (UpdateArticuloDtoImpl)',
                    example: '{"titulo":"Título actualizado","subtitulo":"..."}',
                },
                image_file: { type: 'string', format: 'binary', description: 'Nueva imagen principal' },
                sec_images: { type: 'string', format: 'binary', description: 'Nuevas imágenes de secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 200, description: 'Artículo actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/articulo/editar/:id_articulo')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    updateArticulo(
        @Req() req: Request,
        @Param('id_articulo') id_articulo: string,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) {
            throw new BadRequestException('El campo "data" es requerido en el FormData');
        }
        let updateArticuloDtoImpl: UpdateArticuloDtoImpl;
        try {
            updateArticuloDtoImpl = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        return this.articuloService.updateArticulo(id_usuario, id_articulo, updateArticuloDtoImpl, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar artículo' })
    @ApiParam({ name: 'id_articulo', description: 'ID del artículo a eliminar' })
    @ApiResponse({ status: 200, description: 'Artículo eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/articulo/eliminar/:id_articulo')
    deleteArticulo(
        @Req() req: Request,
        @Param('id_articulo') id_articulo: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.articuloService.deleteArticulo(id_usuario, id_articulo);
    }

    // ─── Ruta pública: ver artículos desde projects públicos ─────────────────

    @ApiOperation({ summary: 'Obtener artículos con sus secciones por proyecto (público)' })
    @ApiQuery({ name: 'usuario_id', required: true, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Sección artículos con artículos y sec_artículos' })
    @ApiResponse({ status: 400, description: 'id de usuario no encontrado' })
    @Public()
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        if (!usuario_id) throw new BadRequestException('id de usuario no encontrado');
        return this.articuloService.findArticulos(usuario_id);
    }

    @ApiOperation({ summary: 'Obtener un artículo por ID' })
    @ApiQuery({ name: 'usuario_id', required: true, description: 'ID del usuario' })
    @ApiParam({ name: 'id_articulo', description: 'ID del artículo' })
    @ApiResponse({ status: 200, description: 'Artículo encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Public()
    @Get('/project/ver/:id_articulo')
    findArticuloByIdPublic(
        @Req() req: Request,
        @Param('id_articulo') id_articulo: string,
        @Query('usuario_id') usuario_id: string,
    ) {
        return this.articuloService.findArticuloById(usuario_id, id_articulo);
    }
}
