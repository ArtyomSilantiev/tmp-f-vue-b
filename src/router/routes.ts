function page (path: string) {
  return () => import(`../pages/${path}`).then(m => m.default || m);
}

export const routes = [
  { path: '/', name: 'main', component: page('main') },

  { path: '/user/:id', name: 'user', component: page('home/user') },

  { path: '/login', name: 'login', component: page('auth/login') },
  { path: '/register', name: 'register', component: page('auth/register') },
  { path: '/password/request_reset', name: 'password.request', component: page('auth/password/request') },
  { path: '/password/reset/:resetCode', name: 'password.reset', component: page('auth/password/reset') },

  { path: '/admin', name: 'admin', component: page('admin/index') },
  { path: '/admin/settings', name: 'admin.settings', component: page('admin/setting/list') },
  { path: '/admin/settings/:name', name: 'admin.settings.item', component: page('admin/setting/item') },
  { path: '/admin/users', name: 'admin.users', component: page('admin/user/list') },

  { path: '*', component: page('not_found') }
];
