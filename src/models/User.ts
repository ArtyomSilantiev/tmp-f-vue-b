import axios, { AxiosResponse } from 'axios';
import Form, { IFormSumbitConfig } from '../lib/form';

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

  public static adminFetchUsers (params?: IUserFetchParams): Promise<AxiosResponse<IUserFetchResult>> {
    return axios.get('/api/admin/user/list', { params: params || null });
  }

  public static adminGetUserById (userId: string): Promise<AxiosResponse<UserModel>> {
    return axios.get('/api/admin/user/byid/' + userId);
  }
}

export class FormUserLogin extends Form <Promise<AxiosResponse<{
  token: string;
}>>> {
  public model = {
    email: '',
    password: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/login', this.model);
  }
}

export class FormUserCreate extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    email: '',
    password: '',
    passwordConfirmation: '',
    city: '',
    recaptchaToken: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/post', this.model);
  }
}

export class FormUserRequestPasswordResetLink extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    email: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/request_password_reset_link', this.model);
  }
}

export class FormUserResetPassword extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    resetPasswordCode: '',
    password: '',
    passwordConfirmation: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/reset_password', this.model);
  }
}

export class FormUserUploadAvatar extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    avatarFile: new Blob()
  };
  public tmpModel = null;
  protected submitAction () {
    const form = new FormData();
    form.append('avatarFile', this.model.avatarFile);
    return axios.post('/api/user/upload_avatar', form);
  }
}

export class FormUserPasswordChange extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/change_password', this.model);
  }
}

export class FormUserSettingsUpdate extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    firstName: '',
    lastName: '',
    city: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/user/settings_update', this.model);
  }
}

export class FormAdminUserChange extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    city: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/admin/user/change', this.model);
  }
}
