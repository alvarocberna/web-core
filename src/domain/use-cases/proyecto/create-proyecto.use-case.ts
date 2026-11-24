// import { ArticuloEntity } from "../entities/articulo.entity"
import {
  CreateProyectoDto,
  CreateArticulosDto,
  CreateEquipoDto,
  CreateServiciosDto,
  CreateTestimoniosDto,
  CreateUsuarioDto,
} from 'src/domain';
import {
  ProyectoRepository,
  ArticuloRepository,
  EquipoRepository,
  ServiciosRepository,
  TestimoniosRepository,
  UsuarioRepository,
} from 'src/domain';
import { ProyectoEntity } from 'src/domain';

interface CreateProyectoUseCaseInterface {
  execute(createProyectoDto: CreateProyectoDto): Promise<ProyectoEntity>;
}

//test: se debe crear una instancia de la clase caso de uso
export class CreateProyectoUseCase implements CreateProyectoUseCaseInterface {
  //test: tenemos inyecciópn de dependencias, x lo q se debe inicializar en el test
  constructor(
    private readonly proyectoRepository: ProyectoRepository,
    private readonly equipoRepository: EquipoRepository,
    private readonly serviciosRepository: ServiciosRepository,
    private readonly articuloRepository: ArticuloRepository,
    private readonly testimoniosRepository: TestimoniosRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}
  public async execute(
    createProyectoDto: CreateProyectoDto,
  ): Promise<ProyectoEntity> {
    const dataEquipo: CreateEquipoDto = {
      titulo: 'Equipo',
      descripcion: null,
      activo: true,
      notificacion: false,
      habilitado: createProyectoDto.equipoHabilitado,
    };
    const dataServicios: CreateServiciosDto = {
      titulo: 'Servicios',
      descripcion: null,
      icono: null,
      activo: true,
      notificacion: false,
      habilitado: createProyectoDto.serviciosHabilitado,
    };
    const dataArticulos: CreateArticulosDto = {
      titulo: 'Articulos',
      descripcion: null,
      activo: true,
      aprobar: true,
      notificacion: false,
      habilitado: createProyectoDto.articulosHabilitado,
    };
    const dataTestimonios: CreateTestimoniosDto = {
      titulo: 'Testimonios',
      descripcion: null,
      activo: true,
      aprobar: true,
      notificacion: false,
      habilitado: createProyectoDto.testimoniosHabilitado,
    };
    const dataUsuario: CreateUsuarioDto = {
      nombre: createProyectoDto.nombre,
      apellido: createProyectoDto.apellido,
      email: createProyectoDto.email,
      password: createProyectoDto.password,
      rol: createProyectoDto.rol,
      imgUrl: null,
      imgAlt: null,
    };

    const proyecto =
      await this.proyectoRepository.createProyecto(createProyectoDto);
    const proyectoId = proyecto.id;
    const usuario = await this.usuarioRepository.createUsuario(
      proyectoId,
      dataUsuario,
    );
    const usuarioId = usuario.id;

    if (createProyectoDto.equipoHabilitado) {
      await this.equipoRepository.createEquipo(usuarioId, dataEquipo);
    }
    if (createProyectoDto.serviciosHabilitado) {
      await this.serviciosRepository.createServicios(usuarioId, dataServicios);
    }
    if (createProyectoDto.articulosHabilitado) {
      await this.articuloRepository.createArticulos(usuarioId, dataArticulos);
    }
    if (createProyectoDto.testimoniosHabilitado) {
      await this.testimoniosRepository.createSecTestimonios(
        usuarioId,
        dataTestimonios,
      );
    }

    return proyecto;
  }
}
