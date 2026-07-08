import { Actividad } from 'generated/prisma';
import { CreateArticuloUseCase } from './create-articulo.use-case';
import { ArticuloRepository, ActividadRepository, CreateArticuloDto, ArticuloEntity, CreateSecArticuloDto, ActividadEntity } from 'src/domain';

describe('CreateArticuloUseCase', () => {
  let useCase: CreateArticuloUseCase;
  let mockArticuloRepository: jest.Mocked<ArticuloRepository>;
  let mockActividadRepository: jest.Mocked<ActividadRepository>;

  beforeEach(() => {
    // Crear mocks de los repositorios inyectados
    mockArticuloRepository = {
      createArticulo: jest.fn(),
      updateArticulo: jest.fn(),
      deleteArticulo: jest.fn(),
      getArticuloById: jest.fn(),
      getAllArticulos: jest.fn(),
    } as any;
    mockActividadRepository = {
      createActividad: jest.fn(),
      getActividadById: jest.fn(),
      getActividadByArticulo: jest.fn(),
      getActividadAll: jest.fn(),
      deleteActividad: jest.fn(),
    } as any;
    // Crear instancia del caso de uso con los mocks
    useCase = new CreateArticuloUseCase(
      mockArticuloRepository,
      mockActividadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {

    //1: caso feliz
    it('should create articulo and register activity successfully', async () => {
      // Arrange
      // argumentos para excecute
      const id_usuario = '12345test678910';
      const createSecArtDto: CreateSecArticuloDto = {
        nro_seccion: 1,
        titulo_sec: 'Sección Test',
        contenido_sec: 'Contenido sección test',
        image_url: '/',
        image_alt: 'alt',
        image_position: 'left',
      } as CreateSecArticuloDto;
      const createDto: CreateArticuloDto = {
        titulo: 'Título Articulo Test',
        subtitulo: 'Subtitulo artículo test',
        autor: 'Usuario Test',
        fecha_publicacion: new Date(),
        fecha_actualizacion: new Date(),
        status: 'null',
        slug: 'null',
        image_url: '/',
        image_alt: 'alt',
        image_position: 'left',
        usuario_id: '12345test678910',
        sec_articulo: [createSecArtDto],
      } as CreateArticuloDto;

      const mockArticulo: ArticuloEntity = {
        id: '12345articulo678910',
        nro_articulo: 1,
        titulo: 'Articulo Test',
        subtitulo: 'Subtitulo articulo test',
        autor: 'Usuario Test',
        fecha_publicacion: new Date(),
        fecha_actualizacion: new Date(),
        status: '-',
        slug: '-',
        image_url: '/',
        image_alt: 'alt' ,
        image_position: 'left' ,
        usuario_id: '12345test678910',
        proyecto_id: '12345proyecto678910',
      } as ArticuloEntity;

      const mockActividad: ActividadEntity = {
          id : '12345actividad',
          accion: 'creado',
          titulo_articulo: 'Articulo Test',
          responsable: 'Usuario Test',
          fecha: new Date(),
          proyecto_id: '12345proyecto678910',
          usuario_id: '12345test678910',
          articulo_id: '12345articulo678910',

      } as ActividadEntity;

      mockArticuloRepository.createArticulo.mockResolvedValue(mockArticulo);
      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);

      // Act
      const result = await useCase.execute(id_usuario, createDto);

      // Assert
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledWith(id_usuario, createDto);
      
      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        id_usuario,
        '12345articulo678910',
        'creado'
      );
      
      expect(result).toBe(mockArticulo);
    });

  });
});
