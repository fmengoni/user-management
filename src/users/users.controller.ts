import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../infra/guard/permission.guard';
import { UsersService } from './users.service';
import { IUser } from './types/user.type';
import ViewModel from '../infra/views/base.viewmodel';
import { JwtAuthGuard } from '../infra/guard/jwt-auth.guard';
import { Permissions } from '../infra/decorators/permission.decorator';
import UserViewModel from './viewModel/users.viewmodel';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Permissions('user:read', 'user:write')
  async findByUsername() {
    return ViewModel.createOne(
      UserViewModel,
      await this.userService.findByUsername('fmengoni'),
    );
  }

  @Post()
  async createUser(@Body() body: Partial<IUser>) {
    return ViewModel.createOne(
      UserViewModel,
      await this.userService.create(body),
    );
  }
}
