import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionMongoRepository } from 'src/permissions/repository/permission.repository';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionMongoRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
