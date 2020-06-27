import axios, { AxiosResponse } from 'axios';
import Form from '../lib/form';

export enum UserRole {
  Guest = 'guest',
  User = 'user',
  Partner = 'partner',
  Admin = 'admin'
}

export interface IUserAuthInfo {
  isAuth: boolean;
  user: UserModel;
}

export interface IUserFetchParams {
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string | null;
  sortDesc?: string | null;
  // filtres
  id?: string | null;
  email?: string | null;
  role?: string | null;
  name?: string | null;
}

export interface IUserFetchResult {
  page: number;
  size: number;
  rows: UserModel[];
  totalRows: number;
}

export default class UserModel {
  public id?: string | null;
  public role?: UserRole | null;
  public email?: string | null;
  public firstName?: string | null;
  public lastName?: string | null;
  public avatar?: string | null;
  public city?: string | null;
  public createdAt?: Date | null;
  public isActivated?: boolean | null;

  public static async getById (userId: number | string): Promise<AxiosResponse<UserModel>> {
    return axios.get('/api/user/byid/' + userId);
  }

  public static async getAuthInfo (): Promise<AxiosResponse<IUserAuthInfo>> {
    return axios.get('/api/user');
  }

  public static async logout () {
    return axios.post('/api/user/logout');
  }

  public static getResedPasswordCodeInfo (resetCode: string) {
    return axios.get('/api/user/reset_password_info?code=' + resetCode);
  }

  public static formLogin () {
    return new Form({
      email: '',
      password: ''
    }, async (model) => {
      return axios.post('/api/user/login', model);
    });
  }

  public static formCreate () {
    return new Form({
      email: '',
      password: '',
      passwordConfirmation: '',
      city: '',
      recaptchaToken: ''
    }, async (model) => {
      return axios.post('/api/user/create', model);
    });
  }

  public static formRequestPasswordResetLink () {
    return new Form({
      email: ''
    }, async (model) => {
      return axios.post('/api/user/request_password_reset_link', model);
    });
  }

  public static formResetPassword () {
    return new Form({
      resetPasswordCode: '',
      password: '',
      passwordConfirmation: ''
    }, async (model) => {
      return axios.post('/api/user/reset_password', model);
    });
  }

  public static formUploadUserAvatar () {
    return new Form({
      avatarFile: new Blob()
    }, async (model) => {
      const form = new FormData();
      form.append('avatarFile', model.avatarFile);
      return axios.post('/api/user/upload_avatar', form);
    });
  }

  public static formPasswordChange () {
    return new Form({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    }, async (model) => {
      return axios.post('/api/user/change_password', model);
    });
  }

  public static formUserSettingsUpdate () {
    return new Form({
      firstName: '',
      lastName: '',
      city: ''
    }, async (model) => {
      return axios.post('/api/user/settings_update', model);
    });
  }

  public static adminFetchUsers (params?: IUserFetchParams): Promise<AxiosResponse<IUserFetchResult>> {
    return axios.get('/api/admin/user/list', { params: params || null });
  }

  public static adminGetUserById (userId: string): Promise<AxiosResponse<UserModel>> {
    return axios.get('/api/admin/user/byid/' + userId);
  }

  public static adminFormChangeUser () {
    return new Form({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      city: ''
    }, async (model) => {
      return axios.post('/api/admin/user/change', model);
    });
  }
}
