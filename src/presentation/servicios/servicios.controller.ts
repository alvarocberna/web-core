import { Controller, Get, Post, Body, Patch, Param, Put, Delete, Req, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { imageMulterOptions } from '../../common/utils/multer.config';
import { ServiciosService } from './servicios.service';
import { CreateServiciosDtoImpl } from './dto/create-servicios.dto';
import { UpdateServiciosDtoImpl } from './dto/update-servicios.dto';
import { CreateServicioDtoImpl } from './dto/create-servicio.dto';
import { UpdateServicioDtoImpl } from './dto/update-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('servicios')
@Controller('servicios')
export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) {}

    private parseOptionalIntField(value: unknown, fieldName: string): number | null {
        if (value === undefined || value === null) return null;

        if (typeof value === 'number') {
            if (!Number.isInteger(value)) {
                throw new BadRequestException(`El campo "${fieldName}" debe ser un entero válido`);
            }
            return value;
        }

        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return null;

            if (!/^-?\d+$/.test(trimmed)) {
                throw new BadRequestException(`El campo "${fieldName}" debe ser un entero válido`);
            }

            const parsed = Number(trimmed);
            if (!Number.isSafeInteger(parsed)) {
                throw new BadRequestException(`El campo "${fieldName}" está fuera de rango`);
            }

            return parsed;
        }

        throw new BadRequestException(`El campo "${fieldName}" debe ser numérico`);
    }

    // ─── Servicios (entidad padre) ───────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear la sec servicios' })
    @ApiResponse({ status: 201, description: 'Sec servicios creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/crear')
    create(
        @Req() req: Request,
        @Body() createServiciosDto: CreateServiciosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.create(id_usuario, createServiciosDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener la info de la sec servicios con servicios' })
    @ApiResponse({ status: 200, description: 'Info sec servicios con servicios' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/ver-todo')
    findAll(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.find(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar sec servicios' })
    @ApiResponse({ status: 200, description: 'Sec servicios actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('/editar')
    update(
        @Req() req: Request,
        @Body() updateServiciosDto: UpdateServiciosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.update(id_usuario, updateServiciosDto);
    }

    // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo servicio con imagen (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', description: 'JSON stringificado con los datos del servicio (CreateServicioDtoImpl)' },
                image_file: { type: 'string', format: 'binary', description: 'Imagen del servicio' },
                sec_images: { type: 'string', format: 'binary', description: 'Imágenes de las secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 201, description: 'Servicio creado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/servicio/crear')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    createServicio(
        @Req() req: Request,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) throw new BadRequestException('El campo "data" es requerido en el FormData');
        let createServicioDto: CreateServicioDtoImpl;
        try {
            createServicioDto = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        createServicioDto.valor = this.parseOptionalIntField(createServicioDto.valor, 'valor');
        createServicioDto.porcentaje_descuento = this.parseOptionalIntField(createServicioDto.porcentaje_descuento, 'porcentaje_descuento');
        createServicioDto.orden = this.parseOptionalIntField(createServicioDto.orden, 'orden');
        return this.serviciosService.createServicio(id_usuario, createServicioDto, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener datos de un servicio' })
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiResponse({ status: 200, description: 'Datos del servicio' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/servicio/ver/:id_servicio')
    findServicio(
        @Req() req: Request,
        @Param('id_servicio') id_servicio: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.findServicio(id_usuario, id_servicio);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar datos de un servicio con imagen (multipart/form-data)' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { type: 'string', description: 'JSON stringificado con los datos a actualizar (UpdateServicioDtoImpl)' },
                image_file: { type: 'string', format: 'binary', description: 'Nueva imagen del servicio' },
                sec_images: { type: 'string', format: 'binary', description: 'Nuevas imágenes de secciones (hasta 20)' },
            },
            required: ['data'],
        },
    })
    @ApiResponse({ status: 200, description: 'Servicio actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/servicio/editar/:id_servicio')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image_file', maxCount: 1 },
            { name: 'sec_images', maxCount: 20 },
        ], imageMulterOptions),
    )
    updateServicio(
        @Req() req: Request,
        @Param('id_servicio') id_servicio: string,
        @Body('data') dataString: string,
        @UploadedFiles() files: {
            image_file?: Express.Multer.File[];
            sec_images?: Express.Multer.File[];
        },
    ) {
        const id_usuario = (req as any).user?.id;
        if (!dataString) throw new BadRequestException('El campo "data" es requerido en el FormData');
        let updateServicioDto: UpdateServicioDtoImpl;
        try {
            updateServicioDto = JSON.parse(dataString);
        } catch {
            throw new BadRequestException('El campo "data" no es un JSON válido');
        }
        updateServicioDto.valor = this.parseOptionalIntField(updateServicioDto.valor, 'valor');
        updateServicioDto.porcentaje_descuento = this.parseOptionalIntField(updateServicioDto.porcentaje_descuento, 'porcentaje_descuento');
        updateServicioDto.orden = this.parseOptionalIntField(updateServicioDto.orden, 'orden');
        return this.serviciosService.updateServicio(id_usuario, id_servicio, updateServicioDto, files);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un servicio' })
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiResponse({ status: 200, description: 'Servicio eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @Roles(Rol.ADMIN, Rol.SUPERADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/servicio/eliminar/:id_servicio')
    removeServicio(
        @Req() req: Request,
        @Param('id_servicio') id_servicio: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.removeServicio(id_usuario, id_servicio);
    }

    // ─── Ruta pública: ver servicios desde projects públicos ────────────────────

    @ApiOperation({ summary: 'Obtener la info de servicios con sus servicios por proyecto (público)' })
    @ApiQuery({ name: 'usuario_id', required: true, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Sec servicios con lista de servicios' })
    @Public()
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        const id_usuario = usuario_id;
        if (!id_usuario) throw new BadRequestException('id de usuario no encontrado');
        return this.serviciosService.find(id_usuario);
    }
}
