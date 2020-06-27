import { computed } from '@vue/composition-api';
import { UserRole } from '../models/User';
import AuthStorage from '@/storages/Auth';

export default function AuthComposition () {
  const token = computed(() => {
    return AuthStorage.getToken();
  });

  const user = computed(() => {
    return AuthStorage.getUser();
  });

  const isAuth = computed(() => {
    const user = AuthStorage.getUser();
    return !!user;
  });

  const isAdmin = computed(() => {
    const user = AuthStorage.getUser();
    return user && user.role === UserRole.Admin;
  });

  return {
    isAuth,
    token,
    user,
    isAdmin
  };
}
