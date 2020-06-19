import { Route } from 'vue-router';
import store from '../store';

export default async (to: Route, from: Route, next: Function) => {
  const user = store.getters['auth/user'];

  if (!user) {
    next({ name: 'login' });
  } else {
    next();
  }
}
