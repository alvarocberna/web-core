import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@ApiTags('usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear usuario con rol ADMIN' })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 201, description: 'Usuario admin creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear usuario con rol USER' })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.usuarioService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Get('/authenticated')
  findOne(@Req() req: Request) {
    const id_usuario = (req as any).user?.id;
    return this.usuarioService.findOne(id_usuario);
  }

  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: any) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
