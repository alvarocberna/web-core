import { ServiciosService } from './servicios.service';
import type {
  ServiciosRepositoryService,
  ImageStorageRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';
import { ServicioEntity } from 'src/domain';

const buildFile = (overrides: Partial<{ size: number; buffer: Buffer }> = {}) =>
  ({ size: 1024, buffer: Buffer.from('data'), ...overrides }) as any;

describe('ServiciosService', () => {
  let service: ServiciosService;
  let mockServiciosRepository: jest.Mocked<ServiciosRepositoryService>;
  let mockImageStorage: jest.Mocked<ImageStorageRepositoryService>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;

  const mockUsuario = {
    id: 'usuario-123',
    proyecto_id: 'proyecto-123',
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

    service = new ServiciosService(mockServiciosRepository, mockImageStorage, mockUsuarioRepository);

    mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Servicios (entidad padre) — pass-through ──────────────────────────

  it('create should delegate to the repository', () => {
    const dto = {} as any;
    service.create('usuario-123', dto);
    expect(mockServiciosRepository.createServicios).toHaveBeenCalledWith('usuario-123', dto);
  });

  it('find should delegate to the repository', () => {
    service.find('usuario-123');
    expect(mockServiciosRepository.getServicios).toHaveBeenCalledWith('usuario-123');
  });

  it('update should delegate to the repository', () => {
    const dto = {} as any;
    service.update('usuario-123', dto);
    expect(mockServiciosRepository.updateServicios).toHaveBeenCalledWith('usuario-123', dto);
  });

  // ─── createServicio ─────────────────────────────────────────────────────

  describe('createServicio', () => {

    it('should create the servicio without touching image storage when no files are provided', async () => {
      const dto = { nombre_servicio: 'Diseño Web', sec_servicio: [] } as any;
      const mockServicio = { id: 'servicio-1' } as ServicioEntity;
      mockServiciosRepository.createServicio.mockResolvedValue(mockServicio);

      const result = await service.createServicio('usuario-123', dto);

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
      expect(mockServiciosRepository.createServicio).toHaveBeenCalledWith('usuario-123', dto);
      expect(result).toBe(mockServicio);
    });

    it('should upload the main image and set img_url on the dto before creating', async () => {
      const dto = { nombre_servicio: 'Diseño Web', sec_servicio: [] } as any;
      const file = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/main.jpg');
      mockServiciosRepository.createServicio.mockResolvedValue({ id: 'servicio-1' } as ServicioEntity);

      await service.createServicio('usuario-123', dto, { image_file: [file] });

      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.img_url).toBe('https://cdn.test/main.jpg');
    });

    it('should upload section images matched by index and set their image_url', async () => {
      const dto = {
        nombre_servicio: 'Diseño Web',
        sec_servicio: [{ titulo_sec: 'Sec 1' }, { titulo_sec: 'Sec 2' }],
      } as any;
      const secFile = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/sec0.jpg');
      mockServiciosRepository.createServicio.mockResolvedValue({ id: 'servicio-1' } as ServicioEntity);

      await service.createServicio('usuario-123', dto, { sec_images: [secFile] });

      expect(dto.sec_servicio[0].image_url).toBe('https://cdn.test/sec0.jpg');
      expect(dto.sec_servicio[1].image_url).toBeUndefined();
    });

    it('should skip empty files (size 0) without calling image storage', async () => {
      const dto = { nombre_servicio: 'Diseño Web', sec_servicio: [{ titulo_sec: 'Sec 1' }] } as any;
      const emptyFile = buildFile({ size: 0 });
      mockServiciosRepository.createServicio.mockResolvedValue({ id: 'servicio-1' } as ServicioEntity);

      await service.createServicio('usuario-123', dto, { sec_images: [emptyFile] });

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
    });
  });

  it('findServicio should delegate to the repository', () => {
    service.findServicio('usuario-123', 'servicio-1');
    expect(mockServiciosRepository.getServicio).toHaveBeenCalledWith('usuario-123', 'servicio-1');
  });

  // ─── updateServicio ─────────────────────────────────────────────────────

  describe('updateServicio', () => {

    it('should replace the main image: delete the old one and upload the new one', async () => {
      const currentServicio = { id: 'servicio-1', img_url: 'https://cdn.test/old-main.jpg', sec_servicio: [] };
      mockServiciosRepository.getServicio.mockResolvedValue(currentServicio as any);
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/new-main.jpg');
      mockServiciosRepository.updateServicio.mockResolvedValue({ id: 'servicio-1' } as ServicioEntity);

      const dto = { sec_servicio: [] } as any;
      const file = buildFile();

      await service.updateServicio('usuario-123', 'servicio-1', dto, { image_file: [file] });

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith('https://cdn.test/old-main.jpg');
      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.img_url).toBe('https://cdn.test/new-main.jpg');
    });

    it('should delete images of sections that were removed from the dto', async () => {
      const currentServicio = {
        id: 'servicio-1',
        img_url: null,
        sec_servicio: [
          { id: 'sec-1', image_url: 'https://cdn.test/sec-1.jpg' },
          { id: 'sec-2', image_url: 'https://cdn.test/sec-2.jpg' },
        ],
      };
      mockServiciosRepository.getServicio.mockResolvedValue(currentServicio as any);
      mockServiciosRepository.updateServicio.mockResolvedValue({ id: 'servicio-1' } as ServicioEntity);

      const dto = { sec_servicio: [{ id: 'sec-1' }] } as any;

      await service.updateServicio('usuario-123', 'servicio-1', dto);

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledTimes(1);
      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith('https://cdn.test/sec-2.jpg');
    });

    it('should call the repository with the final mutated dto', async () => {
      const currentServicio = { id: 'servicio-1', img_url: null, sec_servicio: [] };
      mockServiciosRepository.getServicio.mockResolvedValue(currentServicio as any);
      const updatedServicio = { id: 'servicio-1' } as ServicioEntity;
      mockServiciosRepository.updateServicio.mockResolvedValue(updatedServicio);

      const dto = { sec_servicio: [] } as any;
      const result = await service.updateServicio('usuario-123', 'servicio-1', dto);

      expect(mockServiciosRepository.updateServicio).toHaveBeenCalledWith('usuario-123', 'servicio-1', dto);
      expect(result).toBe(updatedServicio);
    });
  });

  it('updateServicioOrden should delegate to the repository', () => {
    const dto = {} as any;
    service.updateServicioOrden('usuario-123', 'servicio-1', dto);
    expect(mockServiciosRepository.updateServicioOrden).toHaveBeenCalledWith('usuario-123', 'servicio-1', dto);
  });

  // ─── removeServicio ─────────────────────────────────────────────────────

  describe('removeServicio', () => {

    // NOTA: `servicios.service.ts` tiene una segunda línea `return this.serviciosRepository.deleteServicio(...)`
    // después del `return` del use case. Es código inalcanzable (documentado en docs/technical-debt.md) y por
    // eso `deleteServicio` NUNCA se llama directamente: solo se ejecuta a través de `DeleteServicioUseCase`.
    it('should delete the image and delete the servicio only through the use case (dead code after return is never reached)', async () => {
      mockServiciosRepository.deleteServicio.mockResolvedValue(undefined);

      await service.removeServicio('usuario-123', 'servicio-1');

      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith('usuario-123');
      expect(mockImageStorage.deleteImage).toHaveBeenCalledWith(mockUsuario.proyecto_id, 'servicio-1', 'servicio');
      expect(mockServiciosRepository.deleteServicio).toHaveBeenCalledTimes(1);
      expect(mockServiciosRepository.deleteServicio).toHaveBeenCalledWith('usuario-123', 'servicio-1');
    });
  });

  it('findServiciosPublic should delegate to the repository', () => {
    service.findServiciosPublic('proyecto-123');
    expect(mockServiciosRepository.getServiciosPublic).toHaveBeenCalledWith('proyecto-123');
  });
});
