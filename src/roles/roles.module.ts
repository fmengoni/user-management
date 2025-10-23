import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleMongoRepository } from './repository/role.repository';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RoleMongoRepository],
  exports: [RolesService],
})
export class RolesModule {}
