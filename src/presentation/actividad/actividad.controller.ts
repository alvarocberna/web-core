import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActividadService } from './actividad.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('actividad')
@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las actividades del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de actividades' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  findAll(@Req() req: Request,) {
    const id_usuario = (req as any).user?.id;
    return this.actividadService.findAll(id_usuario);
  }

}
