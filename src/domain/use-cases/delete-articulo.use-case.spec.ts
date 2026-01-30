import { DeleteArticuloUseCase } from './delete-articulo.use-case';
import { ArticuloRepository, ActividadRepository, ActividadEntity } from 'src/domain';

describe('DeleteArticuloUseCase', () => {
  let useCase: DeleteArticuloUseCase;
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
    useCase = new DeleteArticuloUseCase(
      mockArticuloRepository,
      mockActividadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {

    //1: caso feliz
    it('should register activity and delete articulo successfully', async () => {
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

      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);
      mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute(id_usuario, id_articulo);

      // Assert
      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        id_usuario,
        id_articulo,
        'eliminado'
      );
      
      expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledWith(id_usuario, id_articulo);
      
      expect(result).toBeUndefined();
    });

    // //2: Orden de llamadas
    // it('should call repositories in correct order (createActividad then deleteArticulo)', async () => {
    //   // Arrange
    //   const callOrder: string[] = [];
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';

    //   mockActividadRepository.createActividad.mockImplementation(async () => {
    //     callOrder.push('createActividad');
    //     return undefined;
    //   });

    //   mockArticuloRepository.deleteArticulo.mockImplementation(async () => {
    //     callOrder.push('deleteArticulo');
    //   });

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo);

    //   // Assert
    //   expect(callOrder).toEqual(['createActividad', 'deleteArticulo']);
    // });

    // //3: Error en createActividad
    // it('should propagate error if createActividad fails', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const expectedError = new Error('Activity registration failed');

    //   mockActividadRepository.createActividad.mockRejectedValue(expectedError);

    //   // Act & Assert
    //   await expect(useCase.execute(id_usuario, id_articulo)).rejects.toThrow('Activity registration failed');
      
    //   // Verificar que deleteArticulo no fue llamado
    //   expect(mockArticuloRepository.deleteArticulo).not.toHaveBeenCalled();
    // });

    // //4: Error en deleteArticulo
    // it('should propagate error if deleteArticulo fails', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const expectedError = new Error('Database connection error');

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockRejectedValue(expectedError);

    //   // Act & Assert
    //   await expect(useCase.execute(id_usuario, id_articulo)).rejects.toThrow('Database connection error');
      
    //   // Verificar que createActividad sí fue llamado
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
    // });

    // //5: ID correcto en actividad
    // it('should use the correct articulo id when creating activity', async () => {
    //   // Arrange
    //   const id_usuario = 'user-999';
    //   const id_articulo = 'unique-id-789';

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo);

    //   // Assert
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
    //     'user-999',
    //     'unique-id-789',
    //     'eliminado'
    //   );
    // });

    // //6: Retorno void
    // it('should return undefined (void)', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

    //   // Act
    //   const result = await useCase.execute(id_usuario, id_articulo);

    //   // Assert
    //   expect(result).toBeUndefined();
    // });

    // //7: Parámetros correctos en deleteArticulo
    // it('should pass correct parameters to deleteArticulo', async () => {
    //   // Arrange
    //   const id_usuario = 'user-test';
    //   const id_articulo = 'articulo-test';

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo);

    //   // Assert
    //   expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledWith(
    //     'user-test',
    //     'articulo-test'
    //   );
    // });

    // //8: Actividad registrada con acción 'eliminado'
    // it('should register activity with action "eliminado"', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo);

    //   // Assert
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
    //     expect.any(String),
    //     expect.any(String),
    //     'eliminado'
    //   );
    // });

    // //9: Múltiples eliminaciones independientes
    // it('should handle multiple independent deletions', async () => {
    //   // Arrange
    //   const articulo1 = { id_usuario: 'user-1', id_articulo: 'art-1' };
    //   const articulo2 = { id_usuario: 'user-2', id_articulo: 'art-2' };

    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);
    //   mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(articulo1.id_usuario, articulo1.id_articulo);
    //   await useCase.execute(articulo2.id_usuario, articulo2.id_articulo);

    //   // Assert
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(2);
    //   expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledTimes(2);
      
    //   expect(mockActividadRepository.createActividad).toHaveBeenNthCalledWith(
    //     1,
    //     'user-1',
    //     'art-1',
    //     'eliminado'
    //   );
    //   expect(mockActividadRepository.createActividad).toHaveBeenNthCalledWith(
    //     2,
    //     'user-2',
    //     'art-2',
    //     'eliminado'
    //   );
    // });
  });
});
