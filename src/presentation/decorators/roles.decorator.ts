//nest
import { SetMetadata } from '@nestjs/common';
//domain
import { Rol } from 'src/domain/enums/rol.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);
