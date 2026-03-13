import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActividadService } from './actividad.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@ApiTags('actividad')
@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las actividades del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de actividades' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Req() req: Request,) {
    const id_usuario = (req as any).user?.id;
    return this.actividadService.findAll(id_usuario);
  }

}
