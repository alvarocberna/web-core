import { UpdateArticuloUseCase } from './update-articulo.use-case';
import { ArticuloRepository, ActividadRepository, UpdateArticuloDto, ArticuloEntity, ActividadEntity } from 'src/domain';

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
      const id_usuario = '12345test678910';
      const id_articulo = '12345articulo678910';
      const updateDto: UpdateArticuloDto = {
        titulo: 'Título Articulo Actualizado',
        subtitulo: 'Subtitulo artículo actualizado',
        autor: 'Usuario Test',
        fecha_actualizacion: new Date(),
        status: 'published',
        slug: 'articulo-actualizado',
        image_url: '/updated',
        image_alt: 'alt updated',
        image_position: 'right',
      } as UpdateArticuloDto;

      const mockArticulo: ArticuloEntity = {
        id: '12345articulo678910',
        nro_articulo: 1,
        titulo: 'Título Articulo Actualizado',
        subtitulo: 'Subtitulo articulo actualizado',
        autor: 'Usuario Test',
        fecha_publicacion: new Date(),
        fecha_actualizacion: new Date(),
        status: 'published',
        slug: 'articulo-actualizado',
        image_url: '/updated',
        image_alt: 'alt updated',
        image_position: 'right',
        autor_id: '12345test678910',
        proyecto_id: '12345proyecto678910',
      } as ArticuloEntity;

      const mockActividad: ActividadEntity = {
        id: '12345actividad',
        accion: 'modificado',
        titulo_articulo: 'Título Articulo Actualizado',
        responsable: 'Usuario Test',
        fecha: new Date(),
        proyecto_id: '12345proyecto678910',
        usuario_id: '12345test678910',
        articulo_id: '12345articulo678910',
      } as ActividadEntity;

      mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
      mockActividadRepository.createActividad.mockResolvedValue(mockActividad);

      // Act
      const result = await useCase.execute(id_usuario, id_articulo, updateDto);

      // Assert
      expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledTimes(1);
      expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledWith(id_usuario, id_articulo, updateDto);
      
      expect(mockActividadRepository.createActividad).toHaveBeenCalledTimes(1);
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        id_usuario,
        '12345articulo678910',
        'modificado'
      );
      
      expect(result).toBe(mockArticulo);
    });

    // //2: Orden de llamadas
    // it('should call repositories in correct order (updateArticulo then createActividad)', async () => {
    //   // Arrange
    //   const callOrder: string[] = [];
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const updateDto = { titulo: 'Updated Title' } as UpdateArticuloDto;

    //   mockArticuloRepository.updateArticulo.mockImplementation(async () => {
    //     callOrder.push('updateArticulo');
    //     return { id: 'articulo-123', titulo: 'Updated Title' } as ArticuloEntity;
    //   });

    //   mockActividadRepository.createActividad.mockImplementation(async () => {
    //     callOrder.push('createActividad');
    //   });

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo, updateDto);

    //   // Assert
    //   expect(callOrder).toEqual(['updateArticulo', 'createActividad']);
    // });

    // //3: Error en updateArticulo
    // it('should propagate error if updateArticulo fails', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const updateDto = { titulo: 'Updated Title' } as UpdateArticuloDto;
    //   const expectedError = new Error('Database connection error');

    //   mockArticuloRepository.updateArticulo.mockRejectedValue(expectedError);

    //   // Act & Assert
    //   await expect(useCase.execute(id_usuario, id_articulo, updateDto)).rejects.toThrow('Database connection error');
      
    //   // Verificar que createActividad no fue llamado
    //   expect(mockActividadRepository.createActividad).not.toHaveBeenCalled();
    // });

    // //4: Error en createActividad
    // it('should propagate error if createActividad fails', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const updateDto = { titulo: 'Updated Title' } as UpdateArticuloDto;
    //   const mockArticulo = { id: 'articulo-123', titulo: 'Updated Title' } as ArticuloEntity;
    //   const expectedError = new Error('Activity registration failed');

    //   mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
    //   mockActividadRepository.createActividad.mockRejectedValue(expectedError);

    //   // Act & Assert
    //   await expect(useCase.execute(id_usuario, id_articulo, updateDto)).rejects.toThrow('Activity registration failed');
      
    //   // Verificar que updateArticulo sí fue llamado
    //   expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledTimes(1);
    // });

    // //5: ID correcto en actividad
    // it('should use the correct articulo id when creating activity', async () => {
    //   // Arrange
    //   const id_usuario = 'user-999';
    //   const id_articulo = 'articulo-999';
    //   const updateDto = { titulo: 'Updated Title' } as UpdateArticuloDto;
    //   const mockArticulo = { id: 'unique-id-789', titulo: 'Updated Title' } as ArticuloEntity;

    //   mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo, updateDto);

    //   // Assert
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
    //     'user-999',
    //     'unique-id-789',
    //     'modificado'
    //   );
    // });

    // //6: retorno de resultado
    // it('should return the updated articulo entity', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const updateDto = { titulo: 'Updated Title' } as UpdateArticuloDto;
    //   const expectedArticulo: ArticuloEntity = {
    //     id: 'articulo-123',
    //     nro_articulo: 1,
    //     titulo: 'Updated Title',
    //     subtitulo: 'Updated Subtitle',
    //     autor: 'Test Author',
    //     fecha_publicacion: new Date(),
    //     fecha_actualizacion: new Date(),
    //     status: 'published',
    //     slug: 'updated-slug',
    //     image_url: '/',
    //     image_alt: 'alt',
    //     image_position: 'left',
    //     autor_id: 'user-123',
    //     proyecto_id: 'proyecto-123',
    //   } as ArticuloEntity;

    //   mockArticuloRepository.updateArticulo.mockResolvedValue(expectedArticulo);
    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);

    //   // Act
    //   const result = await useCase.execute(id_usuario, id_articulo, updateDto);

    //   // Assert
    //   expect(result).toEqual(expectedArticulo);
    //   expect(result.id).toBe('articulo-123');
    //   expect(result.titulo).toBe('Updated Title');
    // });

    // //7: Parámetros correctos al updateArticulo
    // it('should pass correct parameters to updateArticulo', async () => {
    //   // Arrange
    //   const id_usuario = 'user-test';
    //   const id_articulo = 'articulo-test';
    //   const updateDto: UpdateArticuloDto = {
    //     titulo: 'Test Update',
    //     status: 'draft',
    //   } as UpdateArticuloDto;
    //   const mockArticulo = { id: 'articulo-test' } as ArticuloEntity;

    //   mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo, updateDto);

    //   // Assert
    //   expect(mockArticuloRepository.updateArticulo).toHaveBeenCalledWith(
    //     'user-test',
    //     'articulo-test',
    //     updateDto
    //   );
    // });

    // //8: Actividad registrada con acción 'modificado'
    // it('should register activity with action "modificado"', async () => {
    //   // Arrange
    //   const id_usuario = 'user-123';
    //   const id_articulo = 'articulo-123';
    //   const updateDto = { titulo: 'Updated' } as UpdateArticuloDto;
    //   const mockArticulo = { id: 'articulo-123' } as ArticuloEntity;

    //   mockArticuloRepository.updateArticulo.mockResolvedValue(mockArticulo);
    //   mockActividadRepository.createActividad.mockResolvedValue(undefined);

    //   // Act
    //   await useCase.execute(id_usuario, id_articulo, updateDto);

    //   // Assert
    //   expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
    //     expect.any(String),
    //     expect.any(String),
    //     'modificado'
    //   );
    // });
  });
});
