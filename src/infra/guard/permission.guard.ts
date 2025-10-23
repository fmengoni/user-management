import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { UsersService } from '../../users/users.service';
import { PermissionEntity } from 'src/permissions/model/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredPermissions) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not found');

    // Obtener permisos efectivos del usuario (a través de sus roles)
    const roleEntities = await this.usersService.getUserRoles(user.username);

    const userPermissions = roleEntities.flatMap((role) =>
      role.permissions.map((p) => {
        return p instanceof PermissionEntity ? p.permission : p;
      }),
    );
    const uniqueUserPermissions = [...new Set(userPermissions)];

    const hasPermission = requiredPermissions.some((permission) =>
      uniqueUserPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `User lacks required permissions: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
