import PermissionViewModel from '../../permissions/viewModel/permission.viewmodel';
import ViewModel from '../../infra/views/base.viewmodel';
import { RoleEntity } from '../../roles/model/role.entity';

class RoleViewModel extends ViewModel {
  constructor(role: RoleEntity) {
    const data = {
      id: role.id,
      name: role.name,
      permissions: ViewModel.createMany(PermissionViewModel, role.permissions),
    };

    super(data);
  }
}

export default RoleViewModel;
