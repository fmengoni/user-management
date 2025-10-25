import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserMongoRepository } from '../users/repository/user.repository';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  providers: [UsersService, UserMongoRepository],
  controllers: [UsersController],
  exports: [UsersService, UserMongoRepository],
})
export class UsersModule {}
