import { Controller, Req, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@ApiTags('articulo')
@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

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
  @UseGuards(JwtAuthGuard)
  @Post('/crear')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_file', maxCount: 1 },
      { name: 'sec_images', maxCount: 20 },
    ])
  )
  create(
    @Req() req: Request,
    @Body('data') dataString: string,
    @UploadedFiles() files: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    },
  ) {
    //obtener id usuario de las cookies
    const id_usuario = (req as any).user?.id;
    // Validar que dataString existe
    if (!dataString) {
      throw new BadRequestException('El campo "data" es requerido en el FormData');
    }
    // Parsear el JSON del campo 'data'
    let createArticuloDtoImpl: CreateArticuloDtoImpl;
    try {
      createArticuloDtoImpl = JSON.parse(dataString);
    } catch (error) {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }
    return this.articuloService.create(id_usuario, createArticuloDtoImpl, files);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los artículos del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de artículos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Get('/ver-todos')
  findAll(
    @Req() req: Request,
  ) {
    const id_usuario = (req as any).user?.id;
    return this.articuloService.findAll(id_usuario);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un artículo por ID (usuario autenticado)' })
  @ApiParam({ name: 'id_articulo', description: 'ID del artículo' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Get('/ver/:id_articulo')
  findOne(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string
  ) {
    const id_usuario = (req as any).user?.id;
    return this.articuloService.findOne(id_usuario, id_articulo);
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
  @UseGuards(JwtAuthGuard)
  @Put('/editar/:id_articulo')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_file', maxCount: 1 },
      { name: 'sec_images', maxCount: 20 },
    ])
  )
  update(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string,
    @Body('data') dataString: string,
    @UploadedFiles() files: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    },
  ) {
    const id_usuario = (req as any).user?.id;

    // Validar que dataString existe
    if (!dataString) {
      throw new BadRequestException('El campo "data" es requerido en el FormData');
    }

    // Parsear el JSON del campo 'data'
    let updateArticuloDto: UpdateArticuloDtoImpl;
    try {
      updateArticuloDto = JSON.parse(dataString);
    } catch (error) {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }

    return this.articuloService.update(id_usuario, id_articulo, updateArticuloDto, files);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar artículo' })
  @ApiParam({ name: 'id_articulo', description: 'ID del artículo a eliminar' })
  @ApiResponse({ status: 200, description: 'Artículo eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id_articulo')
  remove(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string
  ) {
    const id_usuario = (req as any).user?.id;
    return this.articuloService.delete(id_usuario, id_articulo);
  }

  @ApiOperation({ summary: 'Obtener todos los artículos de un usuario por proyecto (público)' })
  @ApiQuery({ name: 'id_usuario', required: true, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de artículos' })
  @ApiResponse({ status: 400, description: 'id de usuario no encontrado' })
  @Get('project//ver-todos')
  findAll2(
    @Req() req: Request,
    @Query('id_usuario') id_usuario: string,
  ) {
    if(!id_usuario){
      throw new BadRequestException("id de usuario no encontrado")
    }
    return this.articuloService.findAll(id_usuario);
  }

  @ApiOperation({ summary: 'Obtener un artículo por proyecto (público)' })
  @ApiParam({ name: 'id_articulo', description: 'ID del artículo' })
  @ApiQuery({ name: 'id_usuario', required: false, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado' })
  @Get('project/ver/:id_articulo')
  findOne2(
    @Req() req: Request,
    @Query('id_usuario') id_usuario: string,
    @Param('id_articulo') id_articulo: string
  ) {
    return this.articuloService.findOne(id_usuario, id_articulo);
  }
}
