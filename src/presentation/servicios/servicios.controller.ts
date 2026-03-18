import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServiciosDtoImpl } from './dto/create-servicios.dto';
import { UpdateServiciosDtoImpl } from './dto/update-servicios.dto';
import { CreateServicioDtoImpl } from './dto/create-servicio.dto';
import { UpdateServicioDtoImpl } from './dto/update-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('servicios')
@Controller('servicios')
export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) {}

    // ─── Servicios (entidad padre) ───────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear la sec servicios' })
    @ApiResponse({ status: 201, description: 'Sec servicios creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @Get('/ver-todo')
    findAll(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.find(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar sec servicios' })
    @ApiResponse({ status: 200, description: 'Sec servicios actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Put('/editar')
    update(
        @Req() req: Request,
        @Body() updateServiciosDto: UpdateServiciosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.update(id_usuario, updateServiciosDto);
    }

    // ─── Servicio (entidad hijo) ─────────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo servicio' })
    @ApiResponse({ status: 201, description: 'Servicio creado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Post('/servicio/crear')
    createServicio(
        @Req() req: Request,
        @Body() createServicioDto: CreateServicioDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.createServicio(id_usuario, createServicioDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener datos de un servicio' })
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiResponse({ status: 200, description: 'Datos del servicio' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Get('/servicio/ver/:id_servicio')
    findServicio(
        @Req() req: Request,
        @Param('id_servicio') id_servicio: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.findServicio(id_usuario, id_servicio);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar datos de un servicio' })
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiResponse({ status: 200, description: 'Servicio actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Put('/servicio/editar/:id_servicio')
    updateServicio(
        @Req() req: Request,
        @Param('id_servicio') id_servicio: string,
        @Body() updateServicioDto: UpdateServicioDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.serviciosService.updateServicio(id_usuario, id_servicio, updateServicioDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un servicio' })
    @ApiParam({ name: 'id_servicio', description: 'ID del servicio' })
    @ApiResponse({ status: 200, description: 'Servicio eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
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
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        const id_usuario = usuario_id;
        if (!id_usuario) throw new BadRequestException('id de usuario no encontrado');
        return this.serviciosService.find(id_usuario);
    }
}
