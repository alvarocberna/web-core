import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: any) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get('all')
  findAll() {
    return this.usuarioService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/authenticated')
  findOne(@Req() req: Request) {
    const id_usuario = (req as any).user?.id;
    return this.usuarioService.findOne(id_usuario);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: any) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
