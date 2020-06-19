import axios from 'axios';
import store from '../store';
import router from '../router'
import Swal, { SweetAlertOptions } from 'sweetalert2';
import i18n from './i18n';

axios.interceptors.request.use(request => {
  const token = store.getters['auth/token'];
  if (token) {
    request.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

axios.interceptors.response.use(response => response, error => {
  const { status, data } = error.response;

  if (status >= 500) {
    Swal.fire({
      icon: 'error',
      title: i18n.t('labels.errorAlertTitle'),
      text: i18n.t('labels.errorAlertText'),
      reverseButtons: true,
      confirmButtonText: i18n.t('labels.ok'),
      cancelButtonText: i18n.t('labels.cancel')
    } as SweetAlertOptions);
  } else if (status === 401 && store.getters['auth/check']) {
    Swal.fire({
      icon: 'warning',
      title: i18n.t('labels.tokenExpiredAlertTitle'),
      text: i18n.t('labels.tokenExpiredAlertText'),
      reverseButtons: true,
      confirmButtonText: i18n.t('labels.ok'),
      cancelButtonText: i18n.t('labels.cancel')
    } as SweetAlertOptions).then(() => {
      store.commit('auth/LOGOUT');

      router.push({ name: 'login' });
    });
  }

  return Promise.reject(error);
});
