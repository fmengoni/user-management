import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'rolpermissionses';

/**
 * Decorador para definir los roles permitidos en un handler o controller.
 * Ejemplo: @Roles('admin', 'editor')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
