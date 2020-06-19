import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { AuthModule } from './modules/auth';
import { SettingModule } from './modules/setting';
import { RootState } from './types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0'
  },
  modules: {
    auth: AuthModule,
    setting: SettingModule
  }
};

export default new Vuex.Store<RootState>(store)
