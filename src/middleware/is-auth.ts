import MiddlewareWrapper from './MiddlewareWrapper';

export default new MiddlewareWrapper(function ({ next, store }) {
  const user = store.getters['auth/user'];

  if (!user) {
    next({ name: 'login' });
  } else {
    next();
  }
});
