import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import type { UsuarioRepositoryService } from 'src/infrastructure/repository/usuario.repository/usuario.repository.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepositoryService>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'usuario-123',
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@test.com',
    fechaCreacion: new Date(),
    password: 'hashed-password',
    hashedRt: 'hashed-refresh-token',
    rol: 'ADMIN',
    img_url: null,
    img_alt: null,
    proyecto_id: 'proyecto-123',
  };

  const configValues: Record<string, any> = {
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_ACCESS_EXPIRATION: '15m',
    JWT_REFRESH_SECRET: 'refresh-secret',
    JWT_REFRESH_EXPIRATION: '7d',
    BCRYPT_SALT_OR_ROUNDS: 10,
  };

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
    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;
    mockConfigService = {
      get: jest.fn((key: string) => configValues[key]),
    } as any;

    service = new AuthService(mockUsuarioRepository, mockJwtService, mockConfigService);

    mockJwtService.sign.mockImplementation((_payload, options: any) =>
      options?.secret === 'access-secret' ? 'access-token' : 'refresh-token',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserByPassword', () => {

    it('should return null if the user does not exist', async () => {
      mockUsuarioRepository.getUsuarioByEmail.mockResolvedValue(null);

      const result = await service.validateUserByPassword('nadie@test.com', 'pass');

      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null if the password does not match', async () => {
      mockUsuarioRepository.getUsuarioByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUserByPassword('admin@test.com', 'wrong-pass');

      expect(result).toBeNull();
    });

    it('should return the user without password/hashedRt when credentials are valid', async () => {
      mockUsuarioRepository.getUsuarioByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUserByPassword('admin@test.com', 'correct-pass');

      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('hashedRt');
      expect(result).toEqual(
        expect.objectContaining({ id: mockUser.id, email: mockUser.email, rol: mockUser.rol }),
      );
    });
  });

  describe('login', () => {

    it('should sign access and refresh tokens and persist the hashed refresh token', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-refresh-token');

      const result = await service.login({ id: 'usuario-123', email: 'admin@test.com', rol: 'ADMIN' });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 10);
      expect(mockUsuarioRepository.setRefreshToken).toHaveBeenCalledWith(
        'usuario-123',
        'new-hashed-refresh-token',
      );
      expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });
  });

  describe('logout', () => {

    it('should remove the stored refresh token for the user', async () => {
      await service.logout('usuario-123');

      expect(mockUsuarioRepository.removeRefreshToken).toHaveBeenCalledWith('usuario-123');
    });
  });

  describe('verifyRefreshToken', () => {

    it('should throw UnauthorizedException if JWT_REFRESH_SECRET is not configured', () => {
      mockConfigService.get.mockReturnValueOnce(undefined);

      expect(() => service.verifyRefreshToken('some-token')).toThrow(UnauthorizedException);
    });

    it('should verify the token using the configured secret', () => {
      mockJwtService.verify.mockReturnValue({ sub: 'usuario-123', email: 'admin@test.com' });

      const result = service.verifyRefreshToken('some-token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('some-token', { secret: 'refresh-secret' });
      expect(result).toEqual({ sub: 'usuario-123', email: 'admin@test.com' });
    });
  });

  describe('refresh', () => {

    it('should throw UnauthorizedException if the user does not exist', async () => {
      mockUsuarioRepository.getUsuarioById.mockResolvedValue(null);

      await expect(service.refresh('usuario-123', 'rt')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the user has no stored refresh token', async () => {
      mockUsuarioRepository.getUsuarioById.mockResolvedValue({ ...mockUser, hashedRt: null } as any);

      await expect(service.refresh('usuario-123', 'rt')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the refresh token does not match the stored hash', async () => {
      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh('usuario-123', 'invalid-rt')).rejects.toThrow(UnauthorizedException);
    });

    it('should issue new tokens and persist the new hashed refresh token when valid', async () => {
      mockUsuarioRepository.getUsuarioById.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('rotated-hashed-refresh-token');

      const result = await service.refresh('usuario-123', 'valid-rt');

      expect(mockUsuarioRepository.setRefreshToken).toHaveBeenCalledWith(
        'usuario-123',
        'rotated-hashed-refresh-token',
      );
      expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });
  });
});
