import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDtoImpl } from './dto/create-proyecto.dto';
import { UpdateProyectoDtoImpl } from './dto/update-proyecto.dto';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDtoImpl) {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDtoImpl) {
    return this.proyectoService.update(+id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(+id);
  }
}
