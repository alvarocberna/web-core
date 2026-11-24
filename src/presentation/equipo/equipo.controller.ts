import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { imageMulterOptions } from '../../common/utils/multer.config';
import { EquipoService } from './equipo.service';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
import { UpdateEmpleadoOrdenDtoImpl } from './dto/update-empleado-orden.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('equipo')
@Controller('equipo')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  // ─── Equipo (entidad padre) ──────────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear la sec equipo' })
  @ApiResponse({ status: 201, description: 'Sec equipo creada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  create(@Req() req: Request, @Body() createEquipoDto: CreateEquipoDtoImpl) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.create(usuarioId, createEquipoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la info de la sec equipo con empleados' })
  @ApiResponse({ status: 200, description: 'Info sec equipo con empleados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/all')
  findAll(@Req() req: Request) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.find(usuarioId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar sec equipo' })
  @ApiResponse({ status: 200, description: 'Sec equipo actualizada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update')
  update(@Req() req: Request, @Body() updateEquipoDto: UpdateEquipoDtoImpl) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.update(usuarioId, updateEquipoDto);
  }

  // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nuevo empleado con imagen (multipart/form-data)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description:
            'JSON stringificado con los datos del empleado (CreateEmpleadoDtoImpl)',
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del empleado',
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
  @ApiResponse({ status: 201, description: 'Empleado creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/empleado/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'secImages', maxCount: 20 },
      ],
      imageMulterOptions,
    ),
  )
  createEmpleado(
    @Req() req: Request,
    @Body('data') dataString: string,
    @UploadedFiles()
    files: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const usuarioId = (req as any).user?.id;
    if (!dataString)
      throw new BadRequestException(
        'El campo "data" es requerido en el FormData',
      );
    let createEmpleadoDto: CreateEmpleadoDtoImpl;
    try {
      createEmpleadoDto = JSON.parse(dataString);
    } catch {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }
    return this.equipoService.createEmpleado(
      usuarioId,
      createEmpleadoDto,
      files,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos de un empleado' })
  @ApiParam({ name: 'empleadoId', description: 'ID del empleado' })
  @ApiResponse({ status: 200, description: 'Datos del empleado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/empleado/view/:empleadoId')
  findEmpleado(@Req() req: Request, @Param('empleadoId') empleadoId: string) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.findEmpleado(usuarioId, empleadoId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Editar datos de un empleado con imagen (multipart/form-data)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'empleadoId', description: 'ID del empleado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description:
            'JSON stringificado con los datos a actualizar (UpdateEmpleadoDtoImpl)',
        },
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Nueva imagen del empleado',
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
  @ApiResponse({ status: 200, description: 'Empleado actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/empleado/update/:empleadoId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'secImages', maxCount: 20 },
      ],
      imageMulterOptions,
    ),
  )
  updateEmpleado(
    @Req() req: Request,
    @Param('empleadoId') empleadoId: string,
    @Body('data') dataString: string,
    @UploadedFiles()
    files: {
      imageFile?: Express.Multer.File[];
      secImages?: Express.Multer.File[];
    },
  ) {
    const usuarioId = (req as any).user?.id;
    if (!dataString)
      throw new BadRequestException(
        'El campo "data" es requerido en el FormData',
      );
    let updateEmpleadoDto: UpdateEmpleadoDtoImpl;
    try {
      updateEmpleadoDto = JSON.parse(dataString);
    } catch {
      throw new BadRequestException('El campo "data" no es un JSON válido');
    }
    return this.equipoService.updateEmpleado(
      usuarioId,
      empleadoId,
      updateEmpleadoDto,
      files,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar el orden de un empleado' })
  @ApiParam({ name: 'empleadoId', description: 'ID del empleado' })
  @ApiResponse({ status: 200, description: 'Orden del empleado actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/empleado/update/order/:empleadoId')
  updateEmpleadoOrden(
    @Req() req: Request,
    @Param('empleadoId') empleadoId: string,
    @Body() updateEmpleadoOrdenDto: UpdateEmpleadoOrdenDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.updateEmpleadoOrden(
      usuarioId,
      empleadoId,
      updateEmpleadoOrdenDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un empleado' })
  @ApiParam({ name: 'empleadoId', description: 'ID del empleado' })
  @ApiResponse({ status: 200, description: 'Empleado eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/empleado/delete/:empleadoId')
  removeEmpleado(@Req() req: Request, @Param('empleadoId') empleadoId: string) {
    const usuarioId = (req as any).user?.id;
    return this.equipoService.removeEmpleado(usuarioId, empleadoId);
  }

  // ─── Ruta pública: ver equipo desde projects públicos ───────────────────────

  @ApiOperation({
    summary: 'Obtener la info del equipo con empleados por proyecto (público)',
  })
  @ApiQuery({
    name: 'proyectoId',
    required: true,
    description: 'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Sec equipo con lista de empleados',
  })
  @Public()
  @Get('/project/all')
  findAllPublic(@Query('proyectoId') proyectoId: string) {
    if (!proyectoId)
      throw new BadRequestException('id del proyecto no encontrado');
    return this.equipoService.findEquipoPublic(proyectoId);
  }
}
