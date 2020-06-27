import Vue from 'vue';
import Cookies from 'js-cookie';
import axios from 'axios';
import UserModel from '@/models/User';

class AuthStorage {
  private state = <{
    token: string | null;
    user: UserModel | null
  }>Vue.observable({
    token: null,
    user: null
  });

  public init () {
    this.state.token = Cookies.get('token') || null;
  }

  public isAuthAndLoad () {
    return this.state.token && this.state.user;
  }

  public getToken () {
    return this.state.token;
  }

  public setToken (token: string) {
    this.state.token = token;
    Cookies.set('token', token, { expires: 365 });
  }

  public clearToken () {
    this.state.token = null;
    Cookies.remove('token');
  }

  public async fetchUser () {
    try {
      const { data } = await UserModel.getAuthInfo();
      this.state.user = data.user;
    } catch (e) {
      this.state.token = null;
      Cookies.remove('token');
    }
  }

  public updateUser (user: UserModel) {
    this.state.user = user;
  }

  public getUser () {
    return this.state.user;
  }

  public async logout () {
    try {
      await axios.post('/api/user/logout');
      this.state.user = null;
      this.state.token = null;
      Cookies.remove('token');
    } catch (e) {}
  }
}

export default new AuthStorage();
