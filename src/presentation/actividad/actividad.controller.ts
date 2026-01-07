import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Req() req: Request,) {
    const id_usuario = (req as any).user?.id;
    // const id_usuario = "261cfaeb-0d3f-4191-9e91-8563b32206b0";
    return this.actividadService.findAll(id_usuario);
  }

  @Get(':id')
  findByArticulo(@Param('id') id: string) {
    return this.actividadService.findByArticulo(+id);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.actividadService.findOneById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadService.remove(+id);
  }
}
