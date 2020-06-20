import router from '../router';
import { computed, ref, onMounted } from '@vue/composition-api';
import store from '../store';
import UserModel, { UserRole } from '../models/User';

export default function AuthComposition () {
  async function logout () {
    await store.dispatch('auth/logout');
    router.push({ name: 'login' });
  }

  const isAuth = computed(() => {
    return store.getters['auth/check'];
  });

  const token = computed(() => {
    return store.getters['auth/token'];
  });

  const user = computed(() => {
    return store.getters['auth/user'];
  });

  const isAdmin = computed(() => {
    const user = store.getters['auth/user'] as UserModel;
    return user && user.role === UserRole.Admin;
  });

  return {
    isAuth,
    token,
    user,
    isAdmin,

    logout
  };
}
