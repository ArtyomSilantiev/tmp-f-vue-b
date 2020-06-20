import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from '../types';
import Cookies from 'js-cookie'
import UserModel from '../../models/User';
import axios from 'axios';

export interface AuthState {
  user?: UserModel | null;
  token?: string | null;
  error: boolean;
}

const actions: ActionTree<AuthState, RootState> = {
  saveToken ({ commit }, data) {
    commit('saveToken', data);
  },
  async fetchUser ({ commit }) {
    try {
      const { data } = await UserModel.getAuthInfo();
      const user = data.user;
      commit('fetchSuccess', { user: user });
    } catch (e) {
      commit('fetchFailure')
    }
  },
  updateUser ({ commit }, user) {
    commit('updateUser', user);
  },
  async logout ({ commit }) {
    try {
      await axios.post('/api/user/logout');
      commit('logout');
    } catch (e) {}
  }
}

const mutations: MutationTree<AuthState> = {
  saveToken (state, { token, remember }: {
    token: string,
    remember: number | Date | null
  }) {
    state.token = token;
    Cookies.set('token', token, { expires: remember ? 365 : undefined });
  },
  fetchSuccess (state, { user }) {
    if (state.user) {
      state.user = Object.assign(state.user, user);
    } else {
      state.user = user;
    }
  },
  fetchFailure (state) {
    state.token = null;
    Cookies.remove('token');
  },
  logout (state) {
    state.user = null;
    state.token = null;
    Cookies.remove('token');
  },
  updateUser (state, { user }) {
    state.user = user;
  }
};

const getters: GetterTree<AuthState, RootState> = {
  user (state) {
    return state.user;
  },
  token (state) {
    return state.token;
  },
  check (state) {
    return !!state.user;
  }
};

const namespaced: boolean = true;

export const state: AuthState = {
  user: undefined,
  token: Cookies.get('token'),
  error: false
};

export const AuthModule: Module<AuthState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
