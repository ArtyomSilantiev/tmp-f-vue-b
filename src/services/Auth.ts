import BaseService from './_BaseService';
import Cookies from 'js-cookie'
import UserModel from '@/models/User';
import axios from 'axios';

class AuthService extends BaseService {
  private token: string | null = null;
  private user: UserModel | null = null;

  public init () {
    const token = Cookies.get('auth.token');
    if (token) {
      this.token = token;
    } else {
      this.token = null;
    }
  }

  public getToken () {
    return this.token;
  }

  public setToken (token: string) {
    this.token = token;
    Cookies.set('auth.token', token, { expires: 365 });
  }

  public clearToken () {
    this.token = null;
    this.user = null;
    Cookies.remove('auth.token');
  }

  public isAuth () {
    return !!this.token;
  }

  public getUser () {
    return this.user;
  }

  public updateUser () {

  }

  public async logout () {
    try {
      await axios.post('/api/user/logout');
    } catch (e) {e;}

    this.clearToken();
  }
}

export default new AuthService;
