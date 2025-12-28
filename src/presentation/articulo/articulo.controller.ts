import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { CreateArticuloFullDtoImpl, CreateArticuloDtoImpl, CreateSecArticuloDtoImpl } from './dto/create-articulo.dto';

import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';

@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @Post('/:id_proyecto')
  create(
    @Param('id_proyecto') id_proyecto: string, 
    @Body() createArticuloFullDtoImpl: CreateArticuloFullDtoImpl,
  ) {
    return this.articuloService.create(id_proyecto, createArticuloFullDtoImpl);
  }

  @Get('/:id_proyecto')
  findAll(@Param('id_proyecto') id_proyecto: string) {
    return this.articuloService.findAll(id_proyecto);
  }

  @Get('/:id_proyecto/:id_articulo')
  findOne(
    @Param('id_proyecto') id_proyecto: string,
    @Param('id_articulo') id_articulo: string
  ) {
    return this.articuloService.findOne(id_proyecto, id_articulo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDtoImpl) {
    return this.articuloService.update(+id, updateArticuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articuloService.remove(+id);
  }
}
