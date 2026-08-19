import { UpdateArticuloUseCase } from './update-articulo.use-case';
import {
  ArticuloRepository,
  ActividadRepository,
  UpdateArticuloDto,
  ArticuloEntity,
  ActividadEntity,
} from 'src/domain';

describe('UpdateArticuloUseCase', () => {
  let useCase: UpdateArticuloUseCase;
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
    useCase = new UpdateArticuloUseCase(
      mockArticuloRepository,
      mockActividadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    //1: caso feliz
    it('should update articulo and register activity successfully', async () => {
      // Arrange
      // argumentos para execute
      const usuarioId = '12345test678910';
      const articuloId = '12345articulo678910';
      const updateDto: UpdateArticuloDto = {
        titulo: 'Título Articulo Actualizado',
        subtitulo: 'Subtitulo artículo actualizado',
        autor: 'Usuario Test',
        fechaActualizacion: new Date(),
        status: 'published',
        slug: 'articulo-actualizado',
        imageUrl: '/updated',
        imageAlt: 'alt updated',
        imagePosition: 'right',
      } as UpdateArticuloDto;

      const mockArticulo: ArticuloEntity = {
        id: '12345articulo678910',
        nroArticulo: 1,
        titulo: 'Título Articulo Actualizado',
        subtitulo: 'Subtitulo articulo actualizado',
        autor: 'Usuario Test',
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date(),
        status: 'published',
        slug: 'articulo-actualizado',
        imageUrl: '/updated',
        imageAlt: 'alt updated',
        imagePosition: 'right',
        autorId: '12345test678910',
        proyectoId: '12345proyecto678910',
      } as ArticuloEntity;

      const mockActividad: ActividadEntity = {
        id: '12345actividad',
        accion: 'modificado',
        tituloArticulo: 'Título Articulo Actualizado',
        responsable: 'Usuario Test',
        fecha: new Date(),
        proyectoId: '12345proyecto678910',
        usuarioId: '12345test678910',
        articuloId: '12345articulo678910',
      } as ActividadEntity;

      mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);

      // Act
      const result = await useCase.execute(usuarioId, articuloId, updateDto);

      // Assert
      expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledWith(
        usuarioId,
        articuloId,
        updateDto,
      );

      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        usuarioId,
        '12345articulo678910',
        'modificado',
      );

      expect(result).toBe(mockArticulo);
    });
  });
});
