import MiddlewareWrapper from './MiddlewareWrapper';
import { UserRole } from '../models/User';
import AuthStorage from '@/storages/Auth';

export default new MiddlewareWrapper(function ({ next }) {
  const user = AuthStorage.getUser();

  if (!user || user.role !== UserRole.Admin) {
    next({ name: 'login' });
  } else {
    next();
  }
});
