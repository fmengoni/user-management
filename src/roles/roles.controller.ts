import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { IRole } from 'src/users/types/role.type';
import ViewModel from 'src/infra/views/base.viewmodel';
import RoleViewModel from 'src/roles/viewModel/role.viewmodel';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  async createRole(@Body() body: IRole) {
    return ViewModel.createOne(
      RoleViewModel,
      await this.roleService.create(body),
    );
  }

  @Get()
  async findAll() {
    return ViewModel.createMany(
      RoleViewModel,
      await this.roleService.findAll(),
    );
  }
}
