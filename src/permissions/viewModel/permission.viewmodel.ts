import ViewModel from '../../infra/views/base.viewmodel';
import { PermissionEntity } from '../../permissions/model/permission.entity';

class PermissionViewModel extends ViewModel {
  constructor(permission: PermissionEntity) {
    const data = {
      id: permission.id,
      name: permission.name,
      permission: permission.permission,
    };

    super(data);
  }
}

export default PermissionViewModel;
