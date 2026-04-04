import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { imageMulterOptions } from '../../common/utils/multer.config';
import { EquipoService } from './equipo.service';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
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
    @Post('/crear')
    create(
        @Req() req: Request,
        @Body() createEquipoDto: CreateEquipoDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.create(id_usuario, createEquipoDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener la info de la sec equipo con empleados' })
    @ApiResponse({ status: 200, description: 'Info sec equipo con empleados' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/ver-todo')
    findAll(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.find(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar sec equipo' })
    @ApiResponse({ status: 200, description: 'Sec equipo actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('/editar')
    update(
        @Req() req: Request,
        @Body() updateEquipoDto: UpdateEquipoDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.update(id_usuario, updateEquipoDto);
    }

    // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo empleado con imagen (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', description: 'JSON stringificado con los datos del empleado (CreateEmpleadoDtoImpl)' },
                image_file: { type: 'string', format: 'binary', description: 'Imagen del empleado' },
                sec_images: { type: 'string', format: 'binary', description: 'Imágenes de las secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 201, description: 'Empleado creado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/empleado/crear')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    createEmpleado(
        @Req() req: Request,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) throw new BadRequestException('El campo "data" es requerido en el FormData');
        let createEmpleadoDto: CreateEmpleadoDtoImpl;
        try {
            createEmpleadoDto = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        return this.equipoService.createEmpleado(id_usuario, createEmpleadoDto, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener datos de un empleado' })
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiResponse({ status: 200, description: 'Datos del empleado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/empleado/ver/:id_empleado')
    findEmpleado(
        @Req() req: Request,
        @Param('id_empleado') id_empleado: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.findEmpleado(id_usuario, id_empleado);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar datos de un empleado con imagen (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', description: 'JSON stringificado con los datos a actualizar (UpdateEmpleadoDtoImpl)' },
                image_file: { type: 'string', format: 'binary', description: 'Nueva imagen del empleado' },
                sec_images: { type: 'string', format: 'binary', description: 'Nuevas imágenes de secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 200, description: 'Empleado actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('/empleado/editar/:id_empleado')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    updateEmpleado(
        @Req() req: Request,
        @Param('id_empleado') id_empleado: string,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) throw new BadRequestException('El campo "data" es requerido en el FormData');
        let updateEmpleadoDto: UpdateEmpleadoDtoImpl;
        try {
            updateEmpleadoDto = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        return this.equipoService.updateEmpleado(id_usuario, id_empleado, updateEmpleadoDto, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un empleado' })
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiResponse({ status: 200, description: 'Empleado eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/empleado/eliminar/:id_empleado')
    removeEmpleado(
        @Req() req: Request,
        @Param('id_empleado') id_empleado: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.removeEmpleado(id_usuario, id_empleado);
    }

    // ─── Ruta pública: ver equipo desde projects públicos ───────────────────────

    @ApiOperation({ summary: 'Obtener la info del equipo con empleados por proyecto (público)' })
    @ApiQuery({ name: 'usuario_id', required: true, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Sec equipo con lista de empleados' })
    @Public()
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        const id_usuario = usuario_id;
        if (!id_usuario) throw new BadRequestException('id de usuario no encontrado');
        return this.equipoService.find(id_usuario);
    }
}
