import { NotFoundException } from '@nestjs/common';
import { DeleteServicioUseCase } from './delete-servicio.use-case';
import {
  ServiciosRepository,
  ImageStorageRepository,
  UsuarioRepository,
  UsuarioEntity,
} from 'src/domain';

describe('DeleteServicioUseCase', () => {
  let useCase: DeleteServicioUseCase;
  let mockServiciosRepository: jest.Mocked<ServiciosRepository>;
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

    useCase = new DeleteServicioUseCase(
      mockServiciosRepository,
      mockImageStorageRepository,
      mockUsuarioRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {

    //1: caso feliz
    it('should delete the image and delete servicio successfully', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_servicio = '12345servicio678910';

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockImageStorageRepository.deleteImage.mockResolvedValue(undefined);
      mockServiciosRepository.deleteServicio.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(id_usuario, id_servicio);

      // Assert
      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith(id_usuario);

      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledTimes(1);
      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledWith(
        mockUsuario.proyecto_id,
        id_servicio,
        'servicio',
      );

      expect(mockServiciosRepository.deleteServicio).toHaveBeenCalledTimes(1);
      expect(mockServiciosRepository.deleteServicio).toHaveBeenCalledWith(id_usuario, id_servicio);

      expect(result).toBeUndefined();
    });

    //2: usuario no encontrado
    it('should throw NotFoundException and not touch other repositories if usuario does not exist', async () => {
      // Arrange
      const id_usuario = 'usuario-inexistente';
      const id_servicio = '12345servicio678910';

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_servicio)).rejects.toThrow(NotFoundException);

      expect(mockImageStorageRepository.deleteImage).not.toHaveBeenCalled();
      expect(mockServiciosRepository.deleteServicio).not.toHaveBeenCalled();
    });

    //3: fallo al borrar la imagen no debe borrar el servicio
    it('should propagate the error and not delete the servicio if image deletion fails', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_servicio = '12345servicio678910';
      const expectedError = new Error('Storage error');

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockImageStorageRepository.deleteImage.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_servicio)).rejects.toThrow('Storage error');

      expect(mockServiciosRepository.deleteServicio).not.toHaveBeenCalled();
    });
  });
});
