// import { ArticuloEntity } from "../entities/articulo.entity"
import { CreateProyectoDto, CreateArticulosDto, CreateEquipoDto, CreateServiciosDto, CreateTestimoniosDto, CreateUsuarioDto  } from "src/domain"
import { ProyectoRepository, ArticuloRepository, EquipoRepository, ServiciosRepository, TestimoniosRepository, UsuarioRepository  } from "src/domain"
import { ProyectoEntity } from "src/domain"

interface CreateProyectoUseCaseInterface{
    execute(
        createProyectoDto: CreateProyectoDto, 
    ): Promise<ProyectoEntity>
}

//test: se debe crear una instancia de la clase caso de uso
export class CreateProyectoUseCase implements CreateProyectoUseCaseInterface{
    //test: tenemos inyecciópn de dependencias, x lo q se debe inicializar en el test
    constructor(
        private readonly proyectoRepository: ProyectoRepository,
        private readonly equipoRepository: EquipoRepository,
        private readonly serviciosRepository: ServiciosRepository,
        private readonly articuloRepository: ArticuloRepository,
        private readonly testimoniosRepository: TestimoniosRepository,
        private readonly usuarioRepository: UsuarioRepository
    ){}
    public async execute(
        createProyectoDto: CreateProyectoDto,
    ): Promise<ProyectoEntity> {

        const dataEquipo: CreateEquipoDto = {
            titulo: 'Equipo',
            descripcion: null,
            activo: true,
            notificacion: false,
            habilitado: createProyectoDto.equipo_habilitado,
        }
        const dataServicios: CreateServiciosDto = {
            titulo: 'Servicios',
            descripcion: null,
            icono: null,
            activo: true,
            notificacion: false,
            habilitado: createProyectoDto.servicios_habilitado,
        }
        const dataArticulos: CreateArticulosDto = {
            titulo: 'Articulos',
            descripcion: null,
            activo: true,
            aprobar: true,
            notificacion: false,
            habilitado: createProyectoDto.articulos_habilitado,
        }
        const dataTestimonios: CreateTestimoniosDto = {
            titulo: 'Testimonios',
            descripcion: null,
            activo: true,
            aprobar: true,
            notificacion: false,
            habilitado: createProyectoDto.testimonios_habilitado,
        }
        const dataUsuario: CreateUsuarioDto = {
            nombre: createProyectoDto.nombre,
            apellido: createProyectoDto.apellido,
            email: createProyectoDto.email,
            password: createProyectoDto.password,
            rol: createProyectoDto.rol,
            img_url: null,
            img_alt: null,
        }
  
        const proyecto = await this.proyectoRepository.createProyecto(createProyectoDto);
        const id_proyecto = proyecto.id;
        const usuario = await this.usuarioRepository.createUsuario(id_proyecto, dataUsuario)
        const id_usuario = usuario.id;

        if(createProyectoDto.equipo_habilitado){
            await this.equipoRepository.createEquipo(id_usuario, dataEquipo);
        }
        if(createProyectoDto.servicios_habilitado){
            await this.serviciosRepository.createServicios(id_usuario, dataServicios);
        }
        if(createProyectoDto.articulos_habilitado){
            await this.articuloRepository.createArticulos(id_usuario, dataArticulos);
        }
        if(createProyectoDto.testimonios_habilitado){
            await this.testimoniosRepository.createSecTestimonios(id_usuario, dataTestimonios);
        }

        return proyecto;   
    }
}