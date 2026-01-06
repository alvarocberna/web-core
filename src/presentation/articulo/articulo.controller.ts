import { Controller, Req, Get, Post, Body, Patch, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/crear')
  create(
    @Req() req: Request,
    @Body() createArticuloDtoImpl: CreateArticuloDtoImpl,
  ) {
    console.log("intentando crear un articulo")
    const id_usuario = (req as any).user?.id;
    console.log("id usuario:" + id_usuario);
    return this.articuloService.create(id_usuario, createArticuloDtoImpl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ver-todos')
  findAll(
    @Req() req: Request,
  ) {
    const id_usuario = (req as any).user?.id;
    console.log("intentando ver todos los articulos")
    console.log("id usuario: " + id_usuario)
    return this.articuloService.findAll(id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ver/:id_articulo')
  findOne(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string
  ) {
    const id_usuario = (req as any).user?.id;
    return this.articuloService.findOne(id_usuario, id_articulo);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/editar/:id_articulo')
  update(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string, 
    @Body() updateArticuloDto: UpdateArticuloDtoImpl
  ) {
    console.log("intentando actualizar articulo con id: " + id_articulo)
    const id_usuario = (req as any).user?.id;
    return this.articuloService.update(id_usuario, id_articulo, updateArticuloDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id_articulo')
  remove(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string
  ) {
    const id_usuario = (req as any).user?.id;
    return this.articuloService.delete(id_usuario, id_articulo);
  }
}
