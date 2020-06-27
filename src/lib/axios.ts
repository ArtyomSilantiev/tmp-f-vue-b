import axios from 'axios';
import router from '../router'
import Swal, { SweetAlertOptions } from 'sweetalert2';
import i18n from './i18n';
import storages from '@/storages';

axios.interceptors.request.use(request => {
  const token = storages.AuthStorage.getToken();
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
  } else if (status === 401 && storages.AuthStorage.isAuthAndLoad()) {
    Swal.fire({
      icon: 'warning',
      title: i18n.t('labels.tokenExpiredAlertTitle'),
      text: i18n.t('labels.tokenExpiredAlertText'),
      reverseButtons: true,
      confirmButtonText: i18n.t('labels.ok'),
      cancelButtonText: i18n.t('labels.cancel')
    } as SweetAlertOptions).then(() => {
      storages.AuthStorage.logout();
      router.push({ name: 'login' });
    });
  }

  return Promise.reject(error);
});
