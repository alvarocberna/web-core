import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CsrfGuard } from './csrf.guard';

describe('CsrfGuard', () => {
  let guard: CsrfGuard;
  let mockReflector: jest.Mocked<Reflector>;

  const buildContext = (
    method: string,
    headers: Record<string, string | undefined> = {},
    cookies: Record<string, string | undefined> = {},
  ): ExecutionContext => {
    return {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ method, headers, cookies }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new CsrfGuard(mockReflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {

    it('should allow the request when @SkipCsrfCheck() metadata is present, regardless of method', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const context = buildContext('POST', {}, {});

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow safe methods (GET) without requiring any token', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext('GET', {}, {});

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow safe methods (HEAD and OPTIONS) without requiring any token', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      expect(guard.canActivate(buildContext('HEAD'))).toBe(true);
      expect(guard.canActivate(buildContext('OPTIONS'))).toBe(true);
    });

    it('should throw ForbiddenException on an unsafe method when the header token is missing', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext('POST', {}, { csrf_token: 'abc123' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException on an unsafe method when the cookie token is missing', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext('POST', { 'x-csrf-token': 'abc123' }, {});

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when header and cookie tokens do not match', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext(
        'POST',
        { 'x-csrf-token': 'token-a' },
        { csrf_token: 'token-b' },
      );

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when header and cookie tokens have different lengths', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext(
        'POST',
        { 'x-csrf-token': 'short' },
        { csrf_token: 'a-much-longer-token' },
      );

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow the request on an unsafe method when header and cookie tokens match', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = buildContext(
        'POST',
        { 'x-csrf-token': 'matching-token' },
        { csrf_token: 'matching-token' },
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow PUT/DELETE requests with matching tokens', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      expect(
        guard.canActivate(
          buildContext('PUT', { 'x-csrf-token': 'token' }, { csrf_token: 'token' }),
        ),
      ).toBe(true);
      expect(
        guard.canActivate(
          buildContext('DELETE', { 'x-csrf-token': 'token' }, { csrf_token: 'token' }),
        ),
      ).toBe(true);
    });
  });
});
