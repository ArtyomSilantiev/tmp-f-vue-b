import MiddlewareWrapper from './MiddlewareWrapper';
import UserModel, { UserRole } from '../models/User';

export default new MiddlewareWrapper(function ({ next, store }) {
  const user = store.getters['auth/user'] as UserModel;

  if (!user || user.role !== UserRole.Admin) {
    next({ name: 'login' });
  } else {
    next();
  }
});
