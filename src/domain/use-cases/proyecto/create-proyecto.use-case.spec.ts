import { CreateProyectoUseCase } from './create-proyecto.use-case';
import {
  ProyectoRepository,
  ArticuloRepository,
  EquipoRepository,
  ServiciosRepository,
  TestimoniosRepository,
  UsuarioRepository,
  ProyectoEntity,
  UsuarioEntity,
  CreateProyectoDto,
} from 'src/domain';

describe('CreateProyectoUseCase', () => {
  let useCase: CreateProyectoUseCase;
  let mockProyectoRepository: jest.Mocked<ProyectoRepository>;
  let mockEquipoRepository: jest.Mocked<EquipoRepository>;
  let mockServiciosRepository: jest.Mocked<ServiciosRepository>;
  let mockArticuloRepository: jest.Mocked<ArticuloRepository>;
  let mockTestimoniosRepository: jest.Mocked<TestimoniosRepository>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

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

  const baseDto: CreateProyectoDto = {
    nombre_proyecto: 'Proyecto Test',
    descripcion: 'Descripcion test',
    cliente: 'Cliente Test',
    activo: true,
    equipo_habilitado: true,
    servicios_habilitado: true,
    articulos_habilitado: true,
    testimonios_habilitado: true,
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@test.com',
    password: 'plain-password',
    rol: 'ADMIN',
  } as CreateProyectoDto;

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

    useCase = new CreateProyectoUseCase(
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

  describe('execute', () => {

    //1: caso feliz, todas las secciones habilitadas
    it('should create proyecto, usuario and every section when all flags are enabled', async () => {
      // Act
      const result = await useCase.execute(baseDto);

      // Assert
      expect(mockProyectoRepository.createProyecto).toHaveBeenCalledTimes(1);
      expect(mockProyectoRepository.createProyecto).toHaveBeenCalledWith(baseDto);

      expect(mockUsuarioRepository.createUsuario).toHaveBeenCalledTimes(1);
      expect(mockUsuarioRepository.createUsuario).toHaveBeenCalledWith(
        mockProyecto.id,
        expect.objectContaining({
          nombre: baseDto.nombre,
          apellido: baseDto.apellido,
          email: baseDto.email,
          password: baseDto.password,
          rol: baseDto.rol,
        }),
      );

      expect(mockEquipoRepository.createEquipo).toHaveBeenCalledTimes(1);
      expect(mockEquipoRepository.createEquipo).toHaveBeenCalledWith(
        mockUsuario.id,
        expect.objectContaining({ habilitado: true }),
      );

      expect(mockServiciosRepository.createServicios).toHaveBeenCalledTimes(1);
      expect(mockServiciosRepository.createServicios).toHaveBeenCalledWith(
        mockUsuario.id,
        expect.objectContaining({ habilitado: true }),
      );

      expect(mockArticuloRepository.createArticulos).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.createArticulos).toHaveBeenCalledWith(
        mockUsuario.id,
        expect.objectContaining({ habilitado: true }),
      );

      expect(mockTestimoniosRepository.createSecTestimonios).toHaveBeenCalledTimes(1);
      expect(mockTestimoniosRepository.createSecTestimonios).toHaveBeenCalledWith(
        mockUsuario.id,
        expect.objectContaining({ habilitado: true }),
      );

      expect(result).toBe(mockProyecto);
    });

    //2: ninguna seccion habilitada
    it('should create only proyecto and usuario when every section flag is disabled', async () => {
      // Arrange
      const dto: CreateProyectoDto = {
        ...baseDto,
        equipo_habilitado: false,
        servicios_habilitado: false,
        articulos_habilitado: false,
        testimonios_habilitado: false,
      } as CreateProyectoDto;

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(mockProyectoRepository.createProyecto).toHaveBeenCalledTimes(1);
      expect(mockUsuarioRepository.createUsuario).toHaveBeenCalledTimes(1);

      expect(mockEquipoRepository.createEquipo).not.toHaveBeenCalled();
      expect(mockServiciosRepository.createServicios).not.toHaveBeenCalled();
      expect(mockArticuloRepository.createArticulos).not.toHaveBeenCalled();
      expect(mockTestimoniosRepository.createSecTestimonios).not.toHaveBeenCalled();

      expect(result).toBe(mockProyecto);
    });

    //3: habilitacion independiente por seccion
    it('should create only the sections that are individually enabled', async () => {
      // Arrange
      const dto: CreateProyectoDto = {
        ...baseDto,
        equipo_habilitado: true,
        servicios_habilitado: false,
        articulos_habilitado: true,
        testimonios_habilitado: false,
      } as CreateProyectoDto;

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockEquipoRepository.createEquipo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.createArticulos).toHaveBeenCalledTimes(1);
      expect(mockServiciosRepository.createServicios).not.toHaveBeenCalled();
      expect(mockTestimoniosRepository.createSecTestimonios).not.toHaveBeenCalled();
    });

    //4: propagacion de error si falla la creacion del usuario
    it('should propagate the error and not create any section if usuario creation fails', async () => {
      // Arrange
      const expectedError = new Error('Database error');
      mockUsuarioRepository.createUsuario.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(baseDto)).rejects.toThrow('Database error');

      expect(mockEquipoRepository.createEquipo).not.toHaveBeenCalled();
      expect(mockServiciosRepository.createServicios).not.toHaveBeenCalled();
      expect(mockArticuloRepository.createArticulos).not.toHaveBeenCalled();
      expect(mockTestimoniosRepository.createSecTestimonios).not.toHaveBeenCalled();
    });
  });
});
