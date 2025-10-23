import { Body, Controller, Get, Post } from '@nestjs/common';
import ViewModel from 'src/infra/views/base.viewmodel';
import { IPermission } from 'src/users/types/permission.type';
import { PermissionsService } from './permissions.service';
import PermissionViewModel from './viewModel/permission.viewmodel';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Get()
  async findAll() {
    return ViewModel.createMany(
      PermissionViewModel,
      await this.permissionService.findAll(),
    );
  }
  @Post()
  async createPermission(@Body() body: Partial<IPermission>) {
    return ViewModel.createOne(
      PermissionViewModel,
      await this.permissionService.create(body),
    );
  }
}
