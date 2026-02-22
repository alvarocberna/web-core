import { Controller, Req, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDtoImpl } from './dto/create-articulo.dto';
import { UpdateArticuloDtoImpl } from './dto/update-articulo.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/crear')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_file', maxCount: 1 },
      { name: 'sec_images', maxCount: 20 },
    ])
  )
  create(
    @Req() req: Request,
    @Body('data') dataString: string,
    @UploadedFiles() files: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    },
  ) {
    //obtener id usuario de las cookies
    const id_usuario = (req as any).user?.id;
    // Validar que dataString existe
    if (!dataString) {
      throw new Error('El campo "data" es requerido en el FormData');
    }
    // Parsear el JSON del campo 'data'
    let createArticuloDtoImpl: CreateArticuloDtoImpl;
    try {
      createArticuloDtoImpl = JSON.parse(dataString);
    } catch (error) {
      throw new Error(`Error al parsear JSON: ${error.message}`);
    }
    return this.articuloService.create(id_usuario, createArticuloDtoImpl, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ver-todos')
  findAll(
    @Req() req: Request,
  ) {
    const id_usuario = (req as any).user?.id;
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_file', maxCount: 1 },
      { name: 'sec_images', maxCount: 20 },
    ])
  )
  update(
    @Req() req: Request,
    @Param('id_articulo') id_articulo: string,
    @Body('data') dataString: string,
    @UploadedFiles() files: {
        image_file?: Express.Multer.File[],
        sec_images?: Express.Multer.File[]
    },
  ) {
    const id_usuario = (req as any).user?.id;
    
    // Validar que dataString existe
    if (!dataString) {
      throw new Error('El campo "data" es requerido en el FormData');
    }
    
    // Parsear el JSON del campo 'data'
    let updateArticuloDto: UpdateArticuloDtoImpl;
    try {
      updateArticuloDto = JSON.parse(dataString);
    } catch (error) {
      throw new Error(`Error al parsear JSON: ${error.message}`);
    }
    
    return this.articuloService.update(id_usuario, id_articulo, updateArticuloDto, files);
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

  @Get('/ver-todos-x')
  findAll2(
    @Req() req: Request,
    @Query('id_usuario') id_usuario: string,
  ) {
    if(!id_usuario){
      throw new BadRequestException("id de usuario no encontrado")
    }
    return this.articuloService.findAll(id_usuario);
  }

  @Get('/ver-x/:id_articulo')
  findOne2(
    @Req() req: Request,
    @Query('id_usuario') id_usuario: string,
    @Param('id_articulo') id_articulo: string
  ) {
    return this.articuloService.findOne(id_usuario, id_articulo);
  }
}
