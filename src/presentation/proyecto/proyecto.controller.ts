import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDtoImpl } from './dto/create-proyecto.dto';
import { UpdateProyectoDtoImpl } from './dto/update-proyecto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('proyecto')
@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @ApiOperation({ summary: 'Crear proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @Roles(Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/crear')
  create(@Body() createProyectoDto: CreateProyectoDtoImpl) {
    return this.proyectoService.create(createProyectoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos' })
  @Roles(Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/ver-todo')
  findAll() {
    return this.proyectoService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiParam({ name: 'proyecto_id', type: Number })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/ver/:proyecto_id')
  findOne(@Param('proyecto_id') proyecto_id: string) {
    return this.proyectoService.findOne(proyecto_id);
  }

  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiParam({ name: 'proyecto_id', type: Number })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
  @Roles(Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/editar/:proyecto_id')
  update(@Param('proyecto_id') proyecto_id: string, @Body() updateProyectoDto: UpdateProyectoDtoImpl) {
    return this.proyectoService.update(proyecto_id, updateProyectoDto);
  }

  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiParam({ name: 'proyecto_id', type: Number })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado' })
  @Roles(Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/eliminar/:proyecto_id')
  remove(@Param('proyecto_id') proyecto_id: string) {
    return this.proyectoService.remove(proyecto_id);
  }
}
