import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Rol } from 'src/domain/enums/rol.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: jest.Mocked<Reflector>;

  const buildContext = (user: { rol: string } | undefined): ExecutionContext => {
    return {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(mockReflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {

    it('should allow the request when no @Roles() metadata is defined', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = buildContext({ rol: Rol.USER });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow the request when @Roles() is defined with an empty array', () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);
      const context = buildContext({ rol: Rol.USER });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow the request when the user has one of the required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Rol.ADMIN, Rol.SUPERADMIN]);
      const context = buildContext({ rol: Rol.ADMIN });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when the user does not have any of the required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Rol.ADMIN, Rol.SUPERADMIN]);
      const context = buildContext({ rol: Rol.USER });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when there is no authenticated user on the request', () => {
      mockReflector.getAllAndOverride.mockReturnValue([Rol.ADMIN]);
      const context = buildContext(undefined);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
