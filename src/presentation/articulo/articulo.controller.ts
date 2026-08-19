import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
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
  @Post('/create')
  createArticulos(
    @Req() req: Request,
    @Body() createArticulosDto: CreateArticulosDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.createArticulos(usuarioId, createArticulosDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Obtener la sección de artículos con todos sus artículos y secciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Sección artículos con artículos y sec_artículos',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/all')
  findArticulos(@Req() req: Request) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.findArticulos(usuarioId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar la sección de artículos' })
  @ApiResponse({ status: 200, description: 'Sección artículos actualizada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update')
  updateArticulos(
    @Req() req: Request,
    @Body() updateArticulosDto: UpdateArticulosDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.updateArticulos(usuarioId, updateArticulosDto);
  }

  // ─── Articulo (entidad hijo) ──────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear artículo con imágenes (multipart/form-data)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description:
            'JSON stringificado con los datos del artículo (CreateArticuloDtoImpl)',
          example: '{"titulo":"Mi artículo","subtitulo":"..."}',
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Imagen principal del artículo',
        },
        secImages: {
          type: 'string',
          format: 'binary',
          description: 'Imágenes de las secciones (hasta 20)',
        },
      },
      required: ['data'],
    },
  })
  @ApiResponse({ status: 201, description: 'Artículo creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/articulo/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'secImages', maxCount: 20 },
      ],
      imageMulterOptions,
    ),
  )
  createArticulo(
    @Req() req: Request,
    @Body('data') dataString: string,
    @UploadedFiles()
    files: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const usuarioId = (req as any).user?.id;
    if (!dataString) {
      throw new BadRequestException(
        'El campo "data" es requerido en el FormData',
      );
    }
    let createArticuloDtoImpl: CreateArticuloDtoImpl;
    try {
      createArticuloDtoImpl = JSON.parse(dataString);
    } catch {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }
    return this.articuloService.createArticulo(
      usuarioId,
      createArticuloDtoImpl,
      files,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un artículo por ID' })
  @ApiParam({ name: 'articuloId', description: 'ID del artículo' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/articulo/view/:articuloId')
  findArticuloById(
    @Req() req: Request,
    @Param('articuloId') articuloId: string,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.findArticuloById(usuarioId, articuloId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Editar artículo con imágenes (multipart/form-data)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'articuloId', description: 'ID del artículo a editar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description:
            'JSON stringificado con los datos a actualizar (UpdateArticuloDtoImpl)',
          example: '{"titulo":"Título actualizado","subtitulo":"..."}',
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Nueva imagen principal',
        },
        secImages: {
          type: 'string',
          format: 'binary',
          description: 'Nuevas imágenes de secciones (hasta 20)',
        },
      },
      required: ['data'],
    },
  })
  @ApiResponse({ status: 200, description: 'Artículo actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/articulo/update/:articuloId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'secImages', maxCount: 20 },
      ],
      imageMulterOptions,
    ),
  )
  updateArticulo(
    @Req() req: Request,
    @Param('articuloId') articuloId: string,
    @Body('data') dataString: string,
    @UploadedFiles()
    files: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const usuarioId = (req as any).user?.id;
    if (!dataString) {
      throw new BadRequestException(
        'El campo "data" es requerido en el FormData',
      );
    }
    let updateArticuloDtoImpl: UpdateArticuloDtoImpl;
    try {
      updateArticuloDtoImpl = JSON.parse(dataString);
    } catch {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }
    return this.articuloService.updateArticulo(
      usuarioId,
      articuloId,
      updateArticuloDtoImpl,
      files,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar status articulo' })
  @ApiParam({ name: 'articuloId', description: 'ID del artículo a editar' })
  @ApiResponse({ status: 200, description: 'Artículo actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/articulo/update-status/:articuloId')
  updateArticuloStatus(
    @Req() req: Request,
    @Param('articuloId') articuloId: string,
    @Body() body: { status: string },
  ) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.updateArticuloStatus(
      usuarioId,
      articuloId,
      body,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar artículo' })
  @ApiParam({ name: 'articuloId', description: 'ID del artículo a eliminar' })
  @ApiResponse({ status: 200, description: 'Artículo eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/articulo/delete/:articuloId')
  deleteArticulo(@Req() req: Request, @Param('articuloId') articuloId: string) {
    const usuarioId = (req as any).user?.id;
    return this.articuloService.deleteArticulo(usuarioId, articuloId);
  }

  // ─── Ruta pública: ver artículos desde projects públicos ─────────────────

  @ApiOperation({
    summary: 'Obtener artículos con sus secciones por proyecto (público)',
  })
  @ApiQuery({
    name: 'proyectoId',
    required: true,
    description: 'ID del proyecto',
  })
  @ApiResponse({
    status: 200,
    description: 'Sección artículos con artículos y sec_artículos',
  })
  @ApiResponse({ status: 400, description: 'id del proyecto no encontrado' })
  @Public()
  @Get('/project/all')
  findAllPublic(@Query('proyectoId') proyectoId: string) {
    if (!proyectoId)
      throw new BadRequestException('id del proyecto no encontrado');
    return this.articuloService.findArticulosPublic(proyectoId);
  }

  @ApiOperation({ summary: 'Obtener un artículo por ID' })
  @ApiQuery({
    name: 'proyectoId',
    required: true,
    description: 'ID del usuario',
  })
  @ApiParam({ name: 'articuloId', description: 'ID del artículo' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Public()
  @Get('/project/view/:proyectoId')
  findArticuloByIdPublic(
    @Req() req: Request,
    @Param('articuloId') articuloId: string,
    @Query('proyectoId') proyectoId: string,
  ) {
    return this.articuloService.findArticuloByIdPublic(proyectoId, articuloId);
  }
}
