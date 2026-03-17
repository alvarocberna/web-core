import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TestimoniosService } from './testimonios.service';
import { CreateTestimoniosDtoImpl } from './dto/create-testimonios.dto';
import { UpdateTestimoniosDtoImpl } from './dto/update-testimonios.dto';
import { CreateTestimonioDtoImpl } from './dto/create-testimonio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('testimonios')
@Controller('testimonios')
export class TestimoniosController {
    constructor(private readonly testimoniosService: TestimoniosService) {}

    // ─── Testimonios (entidad padre) ────────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear la sec testimonios' })
    @ApiResponse({ status: 200, description: 'Info seccción testimonios' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Post('/crear')
    create(
        @Req() req: Request,
        @Body() createTestimoniosDto: CreateTestimoniosDtoImpl
    ) {
        const id_usuario = (req as any).user?.id;
        return this.testimoniosService.create(id_usuario, createTestimoniosDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener la info de la sec testimonios' })
    @ApiResponse({ status: 200, description: 'Info seccción testimonios' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Get('/ver-todo')
    findAll(@Req() req: Request) {
        const id_usuario = (req as any).user?.id;
        return this.testimoniosService.find(id_usuario);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Editar sec testimonios' })
    @ApiResponse({ status: 200, description: 'Contenedor actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Put('/editar')
    update(
        @Req() req: Request,
        @Body() updateTestimoniosDto: UpdateTestimoniosDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.testimoniosService.update(id_usuario, updateTestimoniosDto);
    }


    // ─── Testimonio (entidad hijo / testimonio individual) ────────────────────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enviar un nuevo testimonio (público)' })
    @ApiResponse({ status: 201, description: 'Testimonio enviado exitosamente' })
    @UseGuards(JwtAuthGuard)
    @Post('/testimonio/crear')
    createTestimonio(
        @Req() req: Request,
        @Body() createTestimonioDto: CreateTestimonioDtoImpl,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.testimoniosService.createTestimonio(id_usuario, createTestimonioDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar testimonio' })
    @ApiParam({ name: 'id_testimonio', description: 'ID del testimonio' })
    @ApiResponse({ status: 200, description: 'Testimonio eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Delete('/testimonio/eliminar/:id_testimonio')
    removeTestimonio(
        @Req() req: Request,
        @Param('id_testimonio') id_testimonio: string,
    ) {
        const id_usuario = (req as any).user?.id;
        return this.testimoniosService.removeTestimonio(id_usuario, id_testimonio);
    }

    // ─── Ruta pública: ver testimonios desde projects publicos ─────────────────────────

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener la info de la sec testimonios y de los testimonios por proyecto (público)' })
    @ApiQuery({ name: 'usuario_id', required: false, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Sec testimonios y lista de testimonios' })
    @Get('/project/ver-todo')
    findAllPublic(
        @Query('usuario_id') usuario_id: string,
    ) {
        const id_usuario = usuario_id;
        if (!id_usuario) throw new BadRequestException('id de usuario no encontrado');
        return this.testimoniosService.find(id_usuario);
    }
}
