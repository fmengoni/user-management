import ViewModel from '../../infra/views/base.viewmodel';
import RoleViewModel from '../../roles/viewModel/role.viewmodel';
import { UserEntity } from '../model/user.entity';

class UserViewModel extends ViewModel {
  constructor(user: UserEntity) {
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: ViewModel.createMany(RoleViewModel, user.roles),
    };

    super(data);
  }
}

export default UserViewModel;
