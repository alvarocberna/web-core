import { EquipoService } from './equipo.service';
import type {
  EquipoRepositoryService,
  ImageStorageRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';
import { EmpleadoEntity } from 'src/domain';

const buildFile = (overrides: Partial<{ size: number; buffer: Buffer }> = {}) =>
  ({ size: 1024, buffer: Buffer.from('data'), ...overrides }) as any;

describe('EquipoService', () => {
  let service: EquipoService;
  let mockEquipoRepository: jest.Mocked<EquipoRepositoryService>;
  let mockImageStorage: jest.Mocked<ImageStorageRepositoryService>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;

  const mockUsuario = {
    id: 'usuario-123',
    proyecto_id: 'proyecto-123',
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
    mockImageStorage = {
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

    service = new EquipoService(mockEquipoRepository, mockImageStorage, mockUsuarioRepository);

    mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Equipo (entidad padre) — pass-through ─────────────────────────────

  it('create should delegate to the repository', () => {
    const dto = {} as any;
    service.create('usuario-123', dto);
    expect(mockEquipoRepository.createEquipo).toHaveBeenCalledWith('usuario-123', dto);
  });

  it('find should delegate to the repository', () => {
    service.find('usuario-123');
    expect(mockEquipoRepository.getEquipo).toHaveBeenCalledWith('usuario-123');
  });

  it('update should delegate to the repository', () => {
    const dto = {} as any;
    service.update('usuario-123', dto);
    expect(mockEquipoRepository.updateEquipo).toHaveBeenCalledWith('usuario-123', dto);
  });

  // ─── createEmpleado ─────────────────────────────────────────────────────

  describe('createEmpleado', () => {

    it('should create the empleado without touching image storage when no files are provided', async () => {
      const dto = { nombre_primero: 'Juan', sec_empleado: [] } as any;
      const mockEmpleado = { id: 'empleado-1' } as EmpleadoEntity;
      mockEquipoRepository.createEmpleado.mockResolvedValue(mockEmpleado);

      const result = await service.createEmpleado('usuario-123', dto);

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
      expect(mockEquipoRepository.createEmpleado).toHaveBeenCalledWith('usuario-123', dto);
      expect(result).toBe(mockEmpleado);
    });

    it('should upload the main image and set img_url on the dto before creating', async () => {
      const dto = { nombre_primero: 'Juan', sec_empleado: [] } as any;
      const file = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/main.jpg');
      mockEquipoRepository.createEmpleado.mockResolvedValue({ id: 'empleado-1' } as EmpleadoEntity);

      await service.createEmpleado('usuario-123', dto, { image_file: [file] });

      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.img_url).toBe('https://cdn.test/main.jpg');
    });

    it('should upload section images matched by index and set their image_url', async () => {
      const dto = {
        nombre_primero: 'Juan',
        sec_empleado: [{ titulo_sec: 'Sec 1' }, { titulo_sec: 'Sec 2' }],
      } as any;
      const secFile = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/sec0.jpg');
      mockEquipoRepository.createEmpleado.mockResolvedValue({ id: 'empleado-1' } as EmpleadoEntity);

      await service.createEmpleado('usuario-123', dto, { sec_images: [secFile] });

      expect(dto.sec_empleado[0].image_url).toBe('https://cdn.test/sec0.jpg');
      expect(dto.sec_empleado[1].image_url).toBeUndefined();
    });

    it('should skip empty files (size 0) without calling image storage', async () => {
      const dto = { nombre_primero: 'Juan', sec_empleado: [{ titulo_sec: 'Sec 1' }] } as any;
      const emptyFile = buildFile({ size: 0 });
      mockEquipoRepository.createEmpleado.mockResolvedValue({ id: 'empleado-1' } as EmpleadoEntity);

      await service.createEmpleado('usuario-123', dto, { sec_images: [emptyFile] });

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
    });
  });

  it('findEmpleado should delegate to the repository', () => {
    service.findEmpleado('usuario-123', 'empleado-1');
    expect(mockEquipoRepository.getEmpleado).toHaveBeenCalledWith('usuario-123', 'empleado-1');
  });

  // ─── updateEmpleado ─────────────────────────────────────────────────────

  describe('updateEmpleado', () => {

    it('should replace the main image: delete the old one and upload the new one', async () => {
      const currentEmpleado = { id: 'empleado-1', img_url: 'https://cdn.test/old-main.jpg', sec_empleado: [] };
      mockEquipoRepository.getEmpleado.mockResolvedValue(currentEmpleado as any);
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/new-main.jpg');
      mockEquipoRepository.updateEmpleado.mockResolvedValue({ id: 'empleado-1' } as EmpleadoEntity);

      const dto = { sec_empleado: [] } as any;
      const file = buildFile();

      await service.updateEmpleado('usuario-123', 'empleado-1', dto, { image_file: [file] });

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith('https://cdn.test/old-main.jpg');
      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.img_url).toBe('https://cdn.test/new-main.jpg');
    });

    it('should delete images of sections that were removed from the dto', async () => {
      const currentEmpleado = {
        id: 'empleado-1',
        img_url: null,
        sec_empleado: [
          { id: 'sec-1', image_url: 'https://cdn.test/sec-1.jpg' },
          { id: 'sec-2', image_url: 'https://cdn.test/sec-2.jpg' },
        ],
      };
      mockEquipoRepository.getEmpleado.mockResolvedValue(currentEmpleado as any);
      mockEquipoRepository.updateEmpleado.mockResolvedValue({ id: 'empleado-1' } as EmpleadoEntity);

      const dto = { sec_empleado: [{ id: 'sec-1' }] } as any;

      await service.updateEmpleado('usuario-123', 'empleado-1', dto);

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledTimes(1);
      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith('https://cdn.test/sec-2.jpg');
    });

    it('should call the repository with the final mutated dto', async () => {
      const currentEmpleado = { id: 'empleado-1', img_url: null, sec_empleado: [] };
      mockEquipoRepository.getEmpleado.mockResolvedValue(currentEmpleado as any);
      const updatedEmpleado = { id: 'empleado-1' } as EmpleadoEntity;
      mockEquipoRepository.updateEmpleado.mockResolvedValue(updatedEmpleado);

      const dto = { sec_empleado: [] } as any;
      const result = await service.updateEmpleado('usuario-123', 'empleado-1', dto);

      expect(mockEquipoRepository.updateEmpleado).toHaveBeenCalledWith('usuario-123', 'empleado-1', dto);
      expect(result).toBe(updatedEmpleado);
    });
  });

  it('updateEmpleadoOrden should delegate to the repository', () => {
    const dto = {} as any;
    service.updateEmpleadoOrden('usuario-123', 'empleado-1', dto);
    expect(mockEquipoRepository.updateEmpleadoOrden).toHaveBeenCalledWith('usuario-123', 'empleado-1', dto);
  });

  // ─── removeEmpleado ─────────────────────────────────────────────────────

  describe('removeEmpleado', () => {

    it('should delete the image and delete the empleado via the use case', async () => {
      mockEquipoRepository.deleteEmpleado.mockResolvedValue(undefined);

      await service.removeEmpleado('usuario-123', 'empleado-1');

      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith('usuario-123');
      expect(mockImageStorage.deleteImage).toHaveBeenCalledWith(mockUsuario.proyecto_id, 'empleado-1', 'empleado');
      expect(mockEquipoRepository.deleteEmpleado).toHaveBeenCalledWith('usuario-123', 'empleado-1');
    });
  });

  it('findEquipoPublic should delegate to the repository', () => {
    service.findEquipoPublic('proyecto-123');
    expect(mockEquipoRepository.getEquipoPublic).toHaveBeenCalledWith('proyecto-123');
  });
});
