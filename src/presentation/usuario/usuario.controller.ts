import { Controller, Get, Req, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDtoImpl } from './dto/create-user.dto';
import { UpdateUsuarioDtoImpl } from './dto/update-user.dto';
import { UpdateUsuarioInfoDtoImpl } from './dto/update-user-info.dto';
import { UpdateUsuarioPasswordDtoImpl } from './dto/update-user-password.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from 'src/domain/enums/rol.enum';

@ApiTags('usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  //------------------------ USUARIO ROL ADMIN Y SUPERADMIN ---------------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear usuario con rol ADMIN' })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 201, description: 'Usuario admin creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/crear')
    async createAdminUser(
      @Body() createUsuarioDto: CreateUsuarioDtoImpl,
      @Req() req: Request,
      @Query('proyecto_id') proyecto_id: string
    ) {
      /*Obtenemos el proyecto_id del query si proviene de un proyecto externo (superamin panel)
        Sino, obtenemos el proyecto_id del req si viene del propio proyecto (admin panel)*/
      let id_proyecto = '';
      if(proyecto_id){
        id_proyecto = proyecto_id;
      }else{
        id_proyecto = (req as any).user?.proyecto_id;
      }
      return this.usuarioService.create(id_proyecto, createUsuarioDto);
    }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/ver-todo')
  findAll(
    @Req() req: Request,
    @Query('proyecto_id') proyecto_id: string
  ) {
      /*Obtenemos el proyecto_id del query si proviene de un proyecto externo (superamin panel)
      Sino, obtenemos el proyecto_id del req si viene del propio proyecto (admin panel)*/
      let id_proyecto = '';
      if(proyecto_id){
        id_proyecto = proyecto_id;
      }else{
        id_proyecto = (req as any).user?.proyecto_id;
      }
    return this.usuarioService.findAll(id_proyecto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un usuario' })
  @ApiParam({ name: 'usuario_id', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/ver/:usuario_id')
  findOne(
    @Param('usuario_id') usuario_id: string,
  ) {
    return this.usuarioService.findById(usuario_id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiParam({ name: 'usuario_id', type: Number })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('admin/editar/:usuario_id')
  update(
    @Param('usuario_id') usuario_id: string,
    @Query('proyecto_id') proyecto_id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDtoImpl,
    @Req() req: Request,
  ) {
    return this.usuarioService.update(usuario_id, updateUsuarioDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiParam({ name: 'usuario_id', type: Number })
  @ApiQuery({ name: 'proyecto_id', required: false, description: 'ID del proyecto al que pertenece el usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @Roles(Rol.SUPERADMIN, Rol.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/eliminar/:usuario_id')
  remove(
    @Param('usuario_id') usuario_id: string,
    @Query('proyecto_id') proyecto_id: string,
    @Req() req: Request,
  ) {
    /*Obtenemos el proyecto_id del query si proviene de un proyecto externo (superamin panel)
    Sino, obtenemos el proyecto_id del req si viene del propio proyecto (admin panel)*/
    let id_proyecto = '';
    if(proyecto_id){
      id_proyecto = proyecto_id;
    }else{
      id_proyecto = (req as any).user?.proyecto_id;
    }
    return this.usuarioService.remove(id_proyecto, usuario_id);
  }

  //---------------------- USUARIO ROL USER -----------------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.USER, Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/authenticated')
  findOne2(@Req() req: Request) {
    const id_usuario = (req as any).user?.id;
    return this.usuarioService.findById(id_usuario);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información del usuario autenticado (nombre, apellido, correo)' })
  @ApiResponse({ status: 200, description: 'Información del usuario actualizada' })
  @ApiResponse({ status: 400, description: 'El correo ya está en uso' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.USER, Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('user/editar')
  updateInfo(@Req() req: Request, @Body() updateUsuarioDto: UpdateUsuarioDtoImpl) {
    const id_usuario = (req as any).user?.id;
    return this.usuarioService.update(id_usuario, updateUsuarioDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  @ApiResponse({ status: 204, description: 'Contraseña actualizada' })
  @ApiResponse({ status: 401, description: 'Contraseña actual incorrecta o no autorizado' })
  @Roles(Rol.USER, Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('user/password')
  updatePassword(@Req() req: Request, @Body() updateUsuarioPasswordDto: UpdateUsuarioPasswordDtoImpl) {
    const id_usuario = (req as any).user?.id;
    return this.usuarioService.updatePassword(id_usuario, updateUsuarioPasswordDto);
  }

}
