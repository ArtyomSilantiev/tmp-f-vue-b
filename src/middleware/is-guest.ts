import MiddlewareWrapper from './MiddlewareWrapper';

export default new MiddlewareWrapper(function ({ next, store }) {
  const token = store.getters['auth/token'];

  if (!token) {
    next();
  } else {
    next({ name: 'main' });
  }
});
