import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TestimoniosService } from './testimonios.service';
import { CreateTestimoniosDtoImpl } from './dto/create-testimonios.dto';
import { UpdateTestimoniosDtoImpl } from './dto/update-testimonios.dto';
import { UpdateTestimonioDtoImpl } from './dto/update-testimonio.dto';
import { CreateTestimonioDtoImpl } from './dto/create-testimonio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Rol } from '../../domain';

@ApiTags('testimonios')
@Controller('testimonios')
export class TestimoniosController {
  constructor(private readonly testimoniosService: TestimoniosService) {}

  // ─── Testimonios (entidad padre) ────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear la sec testimonios' })
  @ApiResponse({ status: 200, description: 'Info seccción testimonios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  create(
    @Req() req: Request,
    @Body() createTestimoniosDto: CreateTestimoniosDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.testimoniosService.create(usuarioId, createTestimoniosDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la info de la sec testimonios' })
  @ApiResponse({ status: 200, description: 'Info seccción testimonios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN, Rol.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/all')
  findAll(@Req() req: Request) {
    const usuarioId = (req as any).user?.id;
    return this.testimoniosService.find(usuarioId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar sec testimonios' })
  @ApiResponse({ status: 200, description: 'Contenedor actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update')
  update(
    @Req() req: Request,
    @Body() updateTestimoniosDto: UpdateTestimoniosDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.testimoniosService.update(usuarioId, updateTestimoniosDto);
  }

  // ─── Testimonio (entidad hijo / testimonio individual) ────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar un nuevo testimonio (público)' })
  @ApiResponse({ status: 201, description: 'Testimonio enviado exitosamente' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/testimonio/create')
  createTestimonio(
    @Req() req: Request,
    @Body() createTestimonioDto: CreateTestimonioDtoImpl,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.testimoniosService.createTestimonio(
      usuarioId,
      createTestimonioDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar status testimonio' })
  @ApiParam({ name: 'testimonioId', description: 'ID del testimonio' })
  @ApiResponse({
    status: 201,
    description: 'Testimonio actualizado exitosamente',
  })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/testimonio/update/:testimonioId')
  updateTestimonio(
    @Req() req: Request,
    @Param('testimonioId') testimonioId: string,
    @Body() updateTestimonioDto: UpdateTestimonioDtoImpl,
  ) {
    return this.testimoniosService.updateTestimonio(
      testimonioId,
      updateTestimonioDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar testimonio' })
  @ApiParam({ name: 'testimonioId', description: 'ID del testimonio' })
  @ApiResponse({ status: 200, description: 'Testimonio eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Rol.ADMIN, Rol.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/testimonio/delete/:testimonioId')
  removeTestimonio(
    @Req() req: Request,
    @Param('testimonioId') testimonioId: string,
  ) {
    const usuarioId = (req as any).user?.id;
    return this.testimoniosService.removeTestimonio(usuarioId, testimonioId);
  }

  // ─── Ruta pública: ver testimonios desde projects publicos ─────────────────────────

  @ApiOperation({
    summary:
      'Obtener la info de la sec testimonios y de los testimonios por proyecto (público)',
  })
  @ApiQuery({
    name: 'usuarioId',
    required: false,
    description: 'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Sec testimonios y lista de testimonios',
  })
  @Public()
  @Get('/project/all')
  findAllPublic(@Query('proyectoId') proyectoId: string) {
    if (!proyectoId)
      throw new BadRequestException('id del proyecto no encontrado');
    return this.testimoniosService.findTestimoniosPublic(proyectoId);
  }

  @ApiOperation({ summary: 'Enviar un nuevo testimonio (público)' })
  @ApiQuery({
    name: 'proyectoId',
    required: false,
    description: 'ID del proyecto',
  })
  @ApiResponse({ status: 201, description: 'Testimonio enviado exitosamente' })
  @Public()
  @Post('/project/testimonio/create')
  createTestimonioPublic(
    @Body() createTestimonioDto: CreateTestimonioDtoImpl,
    @Query('proyectoId') proyectoId: string,
  ) {
    if (!proyectoId)
      throw new BadRequestException('id del proyecto no encontrado');
    return this.testimoniosService.createTestimonioPublic(
      proyectoId,
      createTestimonioDto,
    );
  }
}
