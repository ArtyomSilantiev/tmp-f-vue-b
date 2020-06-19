import { Route } from 'vue-router';
import store from '../store'

export default async (to: Route, from: Route, next: Function) => {
  if (!store.getters['auth/check'] && store.getters['auth/token']) {
    try {
      await store.dispatch('auth/fetchUser')
    } catch (e) { }
  }

  next();
}
