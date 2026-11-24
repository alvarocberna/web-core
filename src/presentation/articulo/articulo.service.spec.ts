import { ArticuloService } from './articulo.service';
import type {
  ArticuloRepositoryService,
  ActividadRepositoryService,
  ImageStorageRepositoryService,
  UsuarioRepositoryService,
} from 'src/infrastructure';
import { ArticuloEntity, ActividadEntity } from 'src/domain';

const buildFile = (overrides: Partial<{ size: number; buffer: Buffer }> = {}) =>
  ({ size: 1024, buffer: Buffer.from('data'), ...overrides }) as any;

describe('ArticuloService', () => {
  let service: ArticuloService;
  let mockArticuloRepository: jest.Mocked<ArticuloRepositoryService>;
  let mockActividadRepository: jest.Mocked<ActividadRepositoryService>;
  let mockImageStorage: jest.Mocked<ImageStorageRepositoryService>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;

  const mockUsuario = {
    id: 'usuario-123',
    proyectoId: 'proyecto-123',
  };

  beforeEach(() => {
    mockArticuloRepository = {
      createArticulos: jest.fn(),
      getArticulos: jest.fn(),
      updateArticulos: jest.fn(),
      createArticulo: jest.fn(),
      getArticuloById: jest.fn(),
      updateArticulo: jest.fn(),
      updateArticuloStatus: jest.fn(),
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

    service = new ArticuloService(
      mockArticuloRepository,
      mockActividadRepository,
      mockImageStorage,
      mockUsuarioRepository,
    );

    mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUsuario as any);
    mockActividadRepository.createActividad.mockResolvedValue(
      {} as ActividadEntity,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Articulos (entidad padre) — pass-through ──────────────────────────────

  it('createArticulos should delegate to the repository', () => {
    const dto = {} as any;
    service.createArticulos('usuario-123', dto);
    expect(mockArticuloRepository.createArticulos).toHaveBeenCalledWith(
      'usuario-123',
      dto,
    );
  });

  it('findArticulos should delegate to the repository', () => {
    service.findArticulos('usuario-123');
    expect(mockArticuloRepository.getArticulos).toHaveBeenCalledWith(
      'usuario-123',
    );
  });

  it('updateArticulos should delegate to the repository', () => {
    const dto = {} as any;
    service.updateArticulos('usuario-123', dto);
    expect(mockArticuloRepository.updateArticulos).toHaveBeenCalledWith(
      'usuario-123',
      dto,
    );
  });

  // ─── createArticulo ─────────────────────────────────────────────────────

  describe('createArticulo', () => {
    it('should create the articulo without touching image storage when no files are provided', async () => {
      const dto = { titulo: 'Test', secArticulo: [] } as any;
      const mockArticulo = { id: 'articulo-1' } as ArticuloEntity;
      mockArticuloRepository.createArticulo.mockResolvedValue(mockArticulo);

      const result = await service.createArticulo('usuario-123', dto);

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledWith(
        'usuario-123',
        dto,
      );
      expect(result).toBe(mockArticulo);
    });

    it('should upload the main image and set imageUrl on the dto before creating', async () => {
      const dto = { titulo: 'Test', secArticulo: [] } as any;
      const file = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/main.jpg');
      mockArticuloRepository.createArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      await service.createArticulo('usuario-123', dto, { imageFile: [file] });

      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.imageUrl).toBe('https://cdn.test/main.jpg');
      expect(mockArticuloRepository.createArticulo).toHaveBeenCalledWith(
        'usuario-123',
        dto,
      );
    });

    it('should upload section images matched by index and set their imageUrl', async () => {
      const dto = {
        titulo: 'Test',
        secArticulo: [{ tituloSec: 'Sec 1' }, { tituloSec: 'Sec 2' }],
      } as any;
      const secFile = buildFile();
      mockImageStorage.saveImage.mockResolvedValue('https://cdn.test/sec0.jpg');
      mockArticuloRepository.createArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      await service.createArticulo('usuario-123', dto, {
        secImages: [secFile],
      });

      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(secFile);
      expect(dto.secArticulo[0].imageUrl).toBe('https://cdn.test/sec0.jpg');
      expect(dto.secArticulo[1].imageUrl).toBeUndefined();
    });

    it('should skip empty files (size 0) without calling image storage', async () => {
      const dto = {
        titulo: 'Test',
        secArticulo: [{ tituloSec: 'Sec 1' }],
      } as any;
      const emptyFile = buildFile({ size: 0 });
      mockArticuloRepository.createArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      await service.createArticulo('usuario-123', dto, {
        secImages: [emptyFile],
      });

      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
      expect(dto.secArticulo[0].imageUrl).toBeUndefined();
    });

    it('should register the activity through the use case after creating the articulo', async () => {
      const dto = { titulo: 'Test', secArticulo: [] } as any;
      const mockArticulo = { id: 'articulo-1' } as ArticuloEntity;
      mockArticuloRepository.createArticulo.mockResolvedValue(mockArticulo);

      await service.createArticulo('usuario-123', dto);

      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        'usuario-123',
        'articulo-1',
        'creado',
      );
    });
  });

  it('findArticuloById should delegate to the repository', () => {
    service.findArticuloById('usuario-123', 'articulo-1');
    expect(mockArticuloRepository.getArticuloById).toHaveBeenCalledWith(
      'usuario-123',
      'articulo-1',
    );
  });

  // ─── updateArticulo ─────────────────────────────────────────────────────

  describe('updateArticulo', () => {
    it('should replace the main image: delete the old one and upload the new one', async () => {
      const currentArticulo = {
        id: 'articulo-1',
        imageUrl: 'https://cdn.test/old-main.jpg',
        secArticulo: [],
      };
      mockArticuloRepository.getArticuloById.mockResolvedValue(
        currentArticulo as any,
      );
      mockImageStorage.saveImage.mockResolvedValue(
        'https://cdn.test/new-main.jpg',
      );
      mockArticuloRepository.updateArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      const dto = { secArticulo: [] } as any;
      const file = buildFile();

      await service.updateArticulo('usuario-123', 'articulo-1', dto, {
        imageFile: [file],
      });

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith(
        'https://cdn.test/old-main.jpg',
      );
      expect(mockImageStorage.saveImage).toHaveBeenCalledWith(file);
      expect(dto.imageUrl).toBe('https://cdn.test/new-main.jpg');
    });

    it('should delete images of sections that were removed from the dto', async () => {
      const currentArticulo = {
        id: 'articulo-1',
        imageUrl: null,
        secArticulo: [
          { id: 'sec-1', imageUrl: 'https://cdn.test/sec-1.jpg' },
          { id: 'sec-2', imageUrl: 'https://cdn.test/sec-2.jpg' },
        ],
      };
      mockArticuloRepository.getArticuloById.mockResolvedValue(
        currentArticulo as any,
      );
      mockArticuloRepository.updateArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      const dto = { secArticulo: [{ id: 'sec-1' }] } as any;

      await service.updateArticulo('usuario-123', 'articulo-1', dto);

      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledTimes(1);
      expect(mockImageStorage.deleteImageByUrl).toHaveBeenCalledWith(
        'https://cdn.test/sec-2.jpg',
      );
    });

    it('should not attempt to delete anything when no sections were removed and no files are sent', async () => {
      const currentArticulo = {
        id: 'articulo-1',
        imageUrl: null,
        secArticulo: [],
      };
      mockArticuloRepository.getArticuloById.mockResolvedValue(
        currentArticulo as any,
      );
      mockArticuloRepository.updateArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      const dto = { secArticulo: [] } as any;

      await service.updateArticulo('usuario-123', 'articulo-1', dto);

      expect(mockImageStorage.deleteImageByUrl).not.toHaveBeenCalled();
      expect(mockImageStorage.saveImage).not.toHaveBeenCalled();
    });

    it('should register the activity through the use case after updating the articulo', async () => {
      const currentArticulo = {
        id: 'articulo-1',
        imageUrl: null,
        secArticulo: [],
      };
      mockArticuloRepository.getArticuloById.mockResolvedValue(
        currentArticulo as any,
      );
      mockArticuloRepository.updateArticulo.mockResolvedValue({
        id: 'articulo-1',
      } as ArticuloEntity);

      const dto = { secArticulo: [] } as any;
      await service.updateArticulo('usuario-123', 'articulo-1', dto);

      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        'usuario-123',
        'articulo-1',
        'modificado',
      );
    });
  });

  it('updateArticuloStatus should delegate to the repository', () => {
    const data = { status: 'PUBLISHED' };
    service.updateArticuloStatus('usuario-123', 'articulo-1', data);
    expect(mockArticuloRepository.updateArticuloStatus).toHaveBeenCalledWith(
      'usuario-123',
      'articulo-1',
      data,
    );
  });

  // ─── deleteArticulo ─────────────────────────────────────────────────────

  describe('deleteArticulo', () => {
    it('should register the activity, delete the image and delete the articulo via the use case', async () => {
      mockArticuloRepository.deleteArticulo.mockResolvedValue(undefined);

      await service.deleteArticulo('usuario-123', 'articulo-1');

      expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith(
        'usuario-123',
      );
      expect(mockActividadRepository.createActividad).toHaveBeenCalledWith(
        'usuario-123',
        'articulo-1',
        'eliminado',
      );
      expect(mockImageStorage.deleteImage).toHaveBeenCalledWith(
        mockUsuario.proyectoId,
        'articulo-1',
        'articulo',
      );
      expect(mockArticuloRepository.deleteArticulo).toHaveBeenCalledWith(
        'usuario-123',
        'articulo-1',
      );
    });
  });

  // ─── PUBLIC — pass-through ──────────────────────────────────────────────

  it('findArticulosPublic should delegate to the repository', () => {
    service.findArticulosPublic('proyecto-123');
    expect(mockArticuloRepository.getArticulosPublic).toHaveBeenCalledWith(
      'proyecto-123',
    );
  });

  it('findArticuloByIdPublic should delegate to the repository', () => {
    service.findArticuloByIdPublic('proyecto-123', 'articulo-1');
    expect(mockArticuloRepository.getArticuloByIdPublic).toHaveBeenCalledWith(
      'proyecto-123',
      'articulo-1',
    );
  });
});
