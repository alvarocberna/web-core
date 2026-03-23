//nest
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
//domain
import { Rol } from 'src/domain/enums/rol.enum';
//decorators
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Sin @Roles() → solo autenticación JWT requerida, no restricción de rol
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Acceso denegado');

    const hasRole = requiredRoles.includes(user.rol as Rol);
    if (!hasRole) throw new ForbiddenException('No tienes permisos para realizar esta acción');

    return true;
  }
}
