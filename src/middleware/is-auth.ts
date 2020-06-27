import MiddlewareWrapper from './MiddlewareWrapper';
import AuthStorage from '@/storages/Auth';

export default new MiddlewareWrapper(function ({ next }) {
  const token = AuthStorage.getToken();

  if (!token) {
    next({ name: 'login' });
  } else {
    next();
  }
});
