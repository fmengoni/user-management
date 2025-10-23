import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserMongoRepository } from 'src/users/repository/user.repository';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [RolesModule],
  providers: [UsersService, UserMongoRepository],
  controllers: [UsersController],
  exports: [UsersService, UserMongoRepository],
})
export class UsersModule {}
