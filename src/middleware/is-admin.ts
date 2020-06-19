import { Route } from 'vue-router';
import store from '../store';
import UserModel, { UserRole } from '../models/User';

export default async (to: Route, from: Route, next: Function) => {
  const user = store.getters['auth/user'] as UserModel;
  if (!user || user.role !== UserRole.Admin) {
    next({ name: 'login' });
  } else {
    next();
  }
}
