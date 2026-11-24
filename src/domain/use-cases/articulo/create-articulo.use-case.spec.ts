import { Actividad } from 'generated/prisma';
import { CreateArticuloUseCase } from './create-articulo.use-case';
import {
  ArticuloRepository,
  ActividadRepository,
  CreateArticuloDto,
  ArticuloEntity,
  CreateSecArticuloDto,
  ActividadEntity,
} from 'src/domain';

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
      const usuarioId = '12345test678910';
      const createSecArtDto: CreateSecArticuloDto = {
        nroSeccion: 1,
        tituloSec: 'Sección Test',
        contenidoSec: 'Contenido sección test',
        imageUrl: '/',
        imageAlt: 'alt',
        imagePosition: 'left',
      } as CreateSecArticuloDto;
      const createDto: CreateArticuloDto = {
        titulo: 'Título Articulo Test',
        subtitulo: 'Subtitulo artículo test',
        autor: 'Usuario Test',
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date(),
        status: 'null',
        slug: 'null',
        imageUrl: '/',
        imageAlt: 'alt',
        imagePosition: 'left',
        usuarioId: '12345test678910',
        secArticulo: [createSecArtDto],
      } as CreateArticuloDto;

      const mockArticulo: ArticuloEntity = {
        id: '12345articulo678910',
        nroArticulo: 1,
        titulo: 'Articulo Test',
        subtitulo: 'Subtitulo articulo test',
        autor: 'Usuario Test',
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date(),
        status: '-',
        slug: '-',
        imageUrl: '/',
        imageAlt: 'alt',
        imagePosition: 'left',
        usuarioId: '12345test678910',
        proyectoId: '12345proyecto678910',
      } as ArticuloEntity;

      const mockActividad: ActividadEntity = {
        id: '12345actividad',
        accion: 'creado',
        tituloArticulo: 'Articulo Test',
        responsable: 'Usuario Test',
        fecha: new Date(),
        proyectoId: '12345proyecto678910',
        usuarioId: '12345test678910',
        articuloId: '12345articulo678910',
      } as ActividadEntity;

      mockArticuloRepository.createArticulo.mockResolvedValue(mockArticulo);
      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);

      // Act
      const result = await useCase.execute(usuarioId, createDto);

      // Assert
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledWith(
        usuarioId,
        createDto,
      );

      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        usuarioId,
        '12345articulo678910',
        'creado',
      );

      expect(result).toBe(mockArticulo);
    });
  });
});
