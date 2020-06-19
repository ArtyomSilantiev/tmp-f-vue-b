import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';
import { RootState } from '../types';
import SettingModel, { ISettingColection } from '../../models/Setting';
import axios from 'axios';

export interface SettingsState {
  userRegistrationDisabled: boolean;
}

const actions: ActionTree<SettingsState, RootState> = {
  async fetchFrontSettings ({ commit }) {
    const { data } = await SettingModel.getFrontCollection();
    commit('saveFrontSettings', data);
  }
}

const mutations: MutationTree<SettingsState> = {
  saveFrontSettings (state, data: ISettingColection) {
    if (data['userRegistrationDisabled'] && data['userRegistrationDisabled'].value === '1') {
      state.userRegistrationDisabled = true;
    } else {
      state.userRegistrationDisabled = false;
    }
  }
};

const getters: GetterTree<SettingsState, RootState> = {
  userRegistrationDisabled (state) {
    return state.userRegistrationDisabled;
  }
};

const namespaced: boolean = true;

export const state: SettingsState = {
  userRegistrationDisabled: false
};

export const SettingModule: Module<SettingsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
