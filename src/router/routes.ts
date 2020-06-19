import IsAuthMidleware from '@/middleware/is-auth';
import IsAdminMidleware from '@/middleware/is-admin';

function page (path: string) {
  return () => import(`../pages/${path}`).then(m => m.default || m);
}

function layout (path: string) {
  return () => import(`../layouts/${path}`).then(m => m.default || m);
}

export const routes = [
  {
    path: '/',
    component: layout('default.vue'),
    children: [
      { path: '', name: 'main', component: page('main') },

      { path: 'login', name: 'login', component: page('auth/login') },
      { path: 'register', name: 'register', component: page('auth/register') },
      { path: 'password/request_reset', name: 'password.request', component: page('auth/password/request') },
      { path: 'password/reset/:resetCode', name: 'password.reset', component: page('auth/password/reset') },
    ],
  },

  {
    path: '/home',
    component: layout('aside.vue'),
    children: [
      { path: 'user/:id', name: 'user', component: page('home/user') }
    ],
    meta: {
      middleware: [ IsAuthMidleware ]
    }
  },

  {
    path: '/admin',
    component: layout('aside.vue'),
    children: [
      { path: '', name: 'admin', component: page('admin/index') },
      { path: 'settings', name: 'admin.settings', component: page('admin/setting/list') },
      { path: 'settings/:name', name: 'admin.settings.item', component: page('admin/setting/item') },
      { path: 'users', name: 'admin.users', component: page('admin/user/list') },
    ],
    meta: {
      midlewares: [ IsAdminMidleware ]
    }
  },

  { path: '*', component: page('not_found') }
];
