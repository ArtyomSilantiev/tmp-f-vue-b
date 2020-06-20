import router from '../router';
import { computed, ref, onMounted } from '@vue/composition-api';
import store from '../store';
import UserModel, { UserRole } from '../models/User';
import axios from 'axios';

export default function AuthComposition () {
  async function logout () {
    try {
      await axios.post('/api/user/logout');
      store.dispatch('auth/logout');
      router.push({ name: 'main' });
    } catch (e) {}
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
