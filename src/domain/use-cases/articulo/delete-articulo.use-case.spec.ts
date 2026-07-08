import { NotFoundException } from '@nestjs/common';
import { DeleteArticuloUseCase } from './delete-articulo.use-case';
import {
  ArticuloRepository,
  ActividadRepository,
  ImageStorageRepository,
  UsuarioRepository,
  ActividadEntity,
  UsuarioEntity,
} from 'src/domain';

describe('DeleteArticuloUseCase', () => {
  let useCase: DeleteArticuloUseCase;
  let mockArticuloRepository: jest.Mocked<ArticuloRepository>;
  let mockActividadRepository: jest.Mocked<ActividadRepository>;
  let mockImageStorageRepository: jest.Mocked<ImageStorageRepository>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

  const mockUsuario: UsuarioEntity = {
    id: '12345test678910',
    nombre: 'Usuario',
    apellido: 'Test',
    email: 'usuario@test.com',
    fechaCreacion: new Date(),
    password: 'hashed-password',
    hashedRt: null,
    rol: 'ADMIN',
    img_url: null,
    img_alt: null,
    proyecto_id: '12345proyecto678910',
  };

  beforeEach(() => {
    // Crear mocks de los repositorios inyectados
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
    mockActividadRepository = {
      createActividad: jest.fn(),
      getActividadById: jest.fn(),
      getActividadByArticulo: jest.fn(),
      getActividadAll: jest.fn(),
      deleteActividad: jest.fn(),
    } as any;
    mockImageStorageRepository = {
      saveImage: jest.fn(),
      deleteImage: jest.fn(),
      deleteImageByUrl: jest.fn(),
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
    // Crear instancia del caso de uso con los mocks
    useCase = new DeleteArticuloUseCase(
      mockArticuloRepository,
      mockActividadRepository,
      mockImageStorageRepository,
      mockUsuarioRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {

    //1: caso feliz
    it('should register activity, delete the image and delete articulo successfully', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_articulo = '12345articulo678910';

      const mockActividad: ActividadEntity = {
        id: '12345actividad',
        accion: 'eliminado',
        titulo_articulo: 'Articulo Test',
        responsable: 'Usuario Test',
        fecha: new Date(),
        proyecto_id: '12345proyecto678910',
        usuario_id: '12345test678910',
        articulo_id: '12345articulo678910',
      } as ActividadEntity;

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);
      mockImageStorageRepository.deleteImage.mockResolvedValue(undefined);
      mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(id_usuario, id_articulo);

      // Assert
      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith(id_usuario);

      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        id_usuario,
        id_articulo,
        'eliminado'
      );

      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledTimes(1);
      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledWith(
        mockUsuario.proyecto_id,
        id_articulo,
        'articulo',
      );

      expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledWith(id_usuario, id_articulo);

      expect(result).toBeUndefined();
    });

    //2: usuario no encontrado
    it('should throw NotFoundException and not touch other repositories if usuario does not exist', async () => {
      // Arrange
      const id_usuario = 'usuario-inexistente';
      const id_articulo = '12345articulo678910';

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_articulo)).rejects.toThrow(NotFoundException);

      expect(mockActividadRepository.createActividad).not.toHaveBeenCalled();
      expect(mockImageStorageRepository.deleteImage).not.toHaveBeenCalled();
      expect(mockArticuloRepository.deleteArticulo).not.toHaveBeenCalled();
    });

    //3: fallo al borrar la imagen no debe borrar el articulo
    it('should propagate the error and not delete the articulo if image deletion fails', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_articulo = '12345articulo678910';
      const expectedError = new Error('Storage error');

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockActividadRepository.createActividad.mockResolvedValue({} as ActividadEntity);
      mockImageStorageRepository.deleteImage.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_articulo)).rejects.toThrow('Storage error');

      expect(mockArticuloRepository.deleteArticulo).not.toHaveBeenCalled();
    });

  });
});
