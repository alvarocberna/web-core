import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('admin/create-user')
    async createAdminUser(
      @Body() createUsuarioDto: CreateUsuarioDtoImpl, 
      @Req() req: Request,
      @Query('proyecto_id') proyecto_id: string) {
      let id_proyecto = '';
      //obten el id del proyecto del query param, sino obtenlo del user payload
      if(proyecto_id){
        id_proyecto = proyecto_id;
      }else{
        id_proyecto = (req as any).user?.proyecto_id;
      }
      //configuramos rol del user acorde a la ruta
      createUsuarioDto.rol = 'ADMIN'
      return this.usuarioService.create(id_proyecto, createUsuarioDto);
    }

  @Post('user/create-user')
    async createUser(
      @Body() createUsuarioDto: CreateUsuarioDtoImpl, 
      @Req() req: Request,
      @Query('proyecto_id') proyecto_id: string) {
      let id_proyecto = '';
      //obten el id del proyecto del query param, sino obtenlo del user payload
      if(proyecto_id){
        id_proyecto = proyecto_id;
      }else{
        id_proyecto = (req as any).user?.proyecto_id;
      }
      //configuramos rol del user acorde a la ruta
      createUsuarioDto.rol = 'USER'
      return this.usuarioService.create(id_proyecto, createUsuarioDto);
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
