import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // Si no hay roles definidos, no restringe el acceso.

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roles) {
      throw new ForbiddenException('No roles found for user');
    }

    // Convertir roles a nombres simples si vienen como objetos de Mongo
    const userRoles = user.roles.map((r: any) =>
      typeof r === 'string' ? r : r.name,
    );

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `User lacks required roles: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
