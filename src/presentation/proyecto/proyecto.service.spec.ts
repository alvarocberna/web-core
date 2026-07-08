import { ProyectoService } from './proyecto.service';
import type {
  ProyectoRepositoryService,
  EquipoRepositoryService,
  ServiciosRepositoryService,
  ArticuloRepositoryService,
  TestimoniosRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';
import { ProyectoEntity, UsuarioEntity, CreateProyectoDto } from 'src/domain';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let mockProyectoRepository: jest.Mocked<ProyectoRepositoryService>;
  let mockEquipoRepository: jest.Mocked<EquipoRepositoryService>;
  let mockServiciosRepository: jest.Mocked<ServiciosRepositoryService>;
  let mockArticuloRepository: jest.Mocked<ArticuloRepositoryService>;
  let mockTestimoniosRepository: jest.Mocked<TestimoniosRepositoryService>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;

  const mockProyecto: ProyectoEntity = {
    id: 'proyecto-123',
    nombre_proyecto: 'Proyecto Test',
    descripcion: 'Descripcion test',
    cliente: 'Cliente Test',
    fecha_inicio: new Date(),
    activo: true,
  };

  const mockUsuario: UsuarioEntity = {
    id: 'usuario-123',
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@test.com',
    fechaCreacion: new Date(),
    password: 'hashed-password',
    hashedRt: null,
    rol: 'ADMIN',
    img_url: null,
    img_alt: null,
    proyecto_id: 'proyecto-123',
  };

  beforeEach(() => {
    mockProyectoRepository = {
      createProyecto: jest.fn(),
      getProyectoById: jest.fn(),
      getAllProyectos: jest.fn(),
      updateProyecto: jest.fn(),
      deleteProyecto: jest.fn(),
    } as any;
    mockEquipoRepository = {
      createEquipo: jest.fn(),
      getEquipo: jest.fn(),
      updateEquipo: jest.fn(),
      createEmpleado: jest.fn(),
      getEmpleado: jest.fn(),
      updateEmpleado: jest.fn(),
      updateEmpleadoOrden: jest.fn(),
      deleteEmpleado: jest.fn(),
      getEquipoPublic: jest.fn(),
    } as any;
    mockServiciosRepository = {
      createServicios: jest.fn(),
      getServicios: jest.fn(),
      updateServicios: jest.fn(),
      createServicio: jest.fn(),
      getServicio: jest.fn(),
      updateServicio: jest.fn(),
      updateServicioOrden: jest.fn(),
      deleteServicio: jest.fn(),
      getServiciosPublic: jest.fn(),
    } as any;
    mockArticuloRepository = {
      createArticulos: jest.fn(),
      getArticulos: jest.fn(),
      updateArticulos: jest.fn(),
      createArticulo: jest.fn(),
      getArticuloById: jest.fn(),
      updateArticulo: jest.fn(),
      updateArticuloStatus: jest.fn(),
      deleteArticulo: jest.fn(),
      getArticulosPublic: jest.fn(),
      getArticuloByIdPublic: jest.fn(),
    } as any;
    mockTestimoniosRepository = {
      createSecTestimonios: jest.fn(),
      getSecTestimonios: jest.fn(),
      updateSecTestimonios: jest.fn(),
      createTestimonio: jest.fn(),
      updateTestimonio: jest.fn(),
      deleteTestimonio: jest.fn(),
      getSecTestimoniosPublic: jest.fn(),
      createTestimonioPublic: jest.fn(),
    } as any;
    mockUsuarioRepository = {
      createUsuario: jest.fn(),
      getUsuarioById: jest.fn(),
      getUsuarioByEmail: jest.fn(),
      getAllUsuarios: jest.fn(),
      updateUsuario: jest.fn(),
      updateUsuarioPassword: jest.fn(),
      deleteUsuario: jest.fn(),
      setRefreshToken: jest.fn(),
      removeRefreshToken: jest.fn(),
    } as any;

    service = new ProyectoService(
      mockProyectoRepository,
      mockEquipoRepository,
      mockServiciosRepository,
      mockArticuloRepository,
      mockTestimoniosRepository,
      mockUsuarioRepository,
    );

    mockProyectoRepository.createProyecto.mockResolvedValue(mockProyecto);
    mockUsuarioRepository.createUsuario.mockResolvedValue(mockUsuario);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {

    it('should create the proyecto and its admin usuario, and enable only the requested sections', async () => {
      const dto: CreateProyectoDto = {
        nombre_proyecto: 'Proyecto Test',
        descripcion: 'Descripcion test',
        cliente: 'Cliente Test',
        activo: true,
        equipo_habilitado: true,
        servicios_habilitado: false,
        articulos_habilitado: true,
        testimonios_habilitado: false,
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin@test.com',
        password: 'plain-password',
        rol: 'ADMIN',
      } as CreateProyectoDto;

      const result = await service.create(dto);

      expect(mockProyectoRepository.createProyecto).toHaveBeenCalledWith(dto);
      expect(mockUsuarioRepository.createUsuario).toHaveBeenCalledWith(
        mockProyecto.id,
        expect.objectContaining({ email: 'admin@test.com' }),
      );
      expect(mockEquipoRepository.createEquipo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.createArticulos).toHaveBeenCalledTimes(1);
      expect(mockServiciosRepository.createServicios).not.toHaveBeenCalled();
      expect(mockTestimoniosRepository.createSecTestimonios).not.toHaveBeenCalled();
      expect(result).toBe(mockProyecto);
    });
  });

  it('findAll should delegate to the repository', () => {
    service.findAll();
    expect(mockProyectoRepository.getAllProyectos).toHaveBeenCalledTimes(1);
  });

  it('findOne should delegate to the repository', () => {
    service.findOne('proyecto-123');
    expect(mockProyectoRepository.getProyectoById).toHaveBeenCalledWith('proyecto-123');
  });

  it('update should delegate to the repository', () => {
    const dto = {} as any;
    service.update('proyecto-123', dto);
    expect(mockProyectoRepository.updateProyecto).toHaveBeenCalledWith('proyecto-123', dto);
  });

  it('remove should delegate to the repository', () => {
    service.remove('proyecto-123');
    expect(mockProyectoRepository.deleteProyecto).toHaveBeenCalledWith('proyecto-123');
  });
});
