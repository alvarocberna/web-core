import { NotFoundException } from '@nestjs/common';
import { DeleteEmpleadoUseCase } from './delete-empleado.use-case';
import {
  EquipoRepository,
  ImageStorageRepository,
  UsuarioRepository,
  UsuarioEntity,
} from 'src/domain';

describe('DeleteEmpleadoUseCase', () => {
  let useCase: DeleteEmpleadoUseCase;
  let mockEquipoRepository: jest.Mocked<EquipoRepository>;
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

    useCase = new DeleteEmpleadoUseCase(
      mockEquipoRepository,
      mockImageStorageRepository,
      mockUsuarioRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {

    //1: caso feliz
    it('should delete the image and delete empleado successfully', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_empleado = '12345empleado678910';

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockImageStorageRepository.deleteImage.mockResolvedValue(undefined);
      mockEquipoRepository.deleteEmpleado.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(id_usuario, id_empleado);

      // Assert
      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith(id_usuario);

      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledTimes(1);
      expect(mockImageStorageRepository.deleteImage).toHaveBeenCalledWith(
        mockUsuario.proyecto_id,
        id_empleado,
        'empleado',
      );

      expect(mockEquipoRepository.deleteEmpleado).toHaveBeenCalledTimes(1);
      expect(mockEquipoRepository.deleteEmpleado).toHaveBeenCalledWith(id_usuario, id_empleado);

      expect(result).toBeUndefined();
    });

    //2: usuario no encontrado
    it('should throw NotFoundException and not touch other repositories if usuario does not exist', async () => {
      // Arrange
      const id_usuario = 'usuario-inexistente';
      const id_empleado = '12345empleado678910';

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_empleado)).rejects.toThrow(NotFoundException);

      expect(mockImageStorageRepository.deleteImage).not.toHaveBeenCalled();
      expect(mockEquipoRepository.deleteEmpleado).not.toHaveBeenCalled();
    });

    //3: fallo al borrar la imagen no debe borrar el empleado
    it('should propagate the error and not delete the empleado if image deletion fails', async () => {
      // Arrange
      const id_usuario = '12345test678910';
      const id_empleado = '12345empleado678910';
      const expectedError = new Error('Storage error');

      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario);
      mockImageStorageRepository.deleteImage.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(id_usuario, id_empleado)).rejects.toThrow('Storage error');

      expect(mockEquipoRepository.deleteEmpleado).not.toHaveBeenCalled();
    });
  });
});
