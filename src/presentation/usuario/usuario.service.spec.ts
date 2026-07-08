import { UsuarioService } from './usuario.service';
import type { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';
import { UsuarioEntity } from 'src/domain';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;

  beforeEach(() => {
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

    service = new UsuarioService(mockUsuarioRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {

    it('should create the usuario through the repository', async () => {
      const dto = { nombre: 'Juan' } as any;
      mockUsuarioRepository.createUsuario.mockResolvedValue({ id: 'usuario-1' } as UsuarioEntity);

      await service.create('proyecto-123', dto);

      expect(mockUsuarioRepository.createUsuario).toHaveBeenCalledWith('proyecto-123', dto);
    });

    it('does not return the created usuario (the repository result is discarded)', async () => {
      mockUsuarioRepository.createUsuario.mockResolvedValue({ id: 'usuario-1' } as UsuarioEntity);

      const result = await service.create('proyecto-123', { nombre: 'Juan' } as any);

      expect(result).toBeUndefined();
    });
  });

  it('findAll should delegate to the repository', () => {
    service.findAll('proyecto-123');
    expect(mockUsuarioRepository.getAllUsuarios).toHaveBeenCalledWith('proyecto-123');
  });

  it('findById should delegate to the repository', () => {
    service.findById('usuario-1');
    expect(mockUsuarioRepository.getUsuarioById).toHaveBeenCalledWith('usuario-1');
  });

  it('update should delegate to the repository', () => {
    const dto = {} as any;
    service.update('usuario-1', dto);
    expect(mockUsuarioRepository.updateUsuario).toHaveBeenCalledWith('usuario-1', dto);
  });

  it('remove should delegate to the repository', () => {
    service.remove('proyecto-123', 'usuario-1');
    expect(mockUsuarioRepository.deleteUsuario).toHaveBeenCalledWith('proyecto-123', 'usuario-1');
  });

  it('updatePassword should delegate to the repository', () => {
    const dto = {} as any;
    service.updatePassword('usuario-1', dto);
    expect(mockUsuarioRepository.updateUsuarioPassword).toHaveBeenCalledWith('usuario-1', dto);
  });
});
