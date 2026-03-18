import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EquipoService } from './equipo.service';
import { CreateEquipoDtoImpl } from './dto/create-equipo.dto';
import { UpdateEquipoDtoImpl } from './dto/update-equipo.dto';
import { CreateEmpleadoDtoImpl } from './dto/create-empleado.dto';
import { UpdateEmpleadoDtoImpl } from './dto/update-empleado.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('equipo')
@Controller('equipo')
export class EquipoController {
    constructor(private readonly equipoService: EquipoService) {}

    // ─── Equipo (entidad padre) ──────────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear la sec equipo' })
    @ApiResponse({ status: 201, description: 'Sec equipo creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @Get('/ver-todo')
    findAll(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.find(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar sec equipo' })
    @ApiResponse({ status: 200, description: 'Sec equipo actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Put('/editar')
    update(
        @Req() req: Request,
        @Body() updateEquipoDto: UpdateEquipoDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.update(id_usuario, updateEquipoDto);
    }

    // ─── Empleado (entidad hijo) ─────────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo empleado' })
    @ApiResponse({ status: 201, description: 'Empleado creado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Post('/empleado/crear')
    createEmpleado(
        @Req() req: Request,
        @Body() createEmpleadoDto: CreateEmpleadoDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.createEmpleado(id_usuario, createEmpleadoDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener datos de un empleado' })
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiResponse({ status: 200, description: 'Datos del empleado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Get('/empleado/ver/:id_empleado')
    findEmpleado(
        @Req() req: Request,
        @Param('id_empleado') id_empleado: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.findEmpleado(id_usuario, id_empleado);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar datos de un empleado' })
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiResponse({ status: 200, description: 'Empleado actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Put('/empleado/editar/:id_empleado')
    updateEmpleado(
        @Req() req: Request,
        @Param('id_empleado') id_empleado: string,
        @Body() updateEmpleadoDto: UpdateEmpleadoDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.equipoService.updateEmpleado(id_usuario, id_empleado, updateEmpleadoDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un empleado' })
    @ApiParam({ name: 'id_empleado', description: 'ID del empleado' })
    @ApiResponse({ status: 200, description: 'Empleado eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
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
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        const id_usuario = usuario_id;
        if (!id_usuario) throw new BadRequestException('id de usuario no encontrado');
        return this.equipoService.find(id_usuario);
    }
}
