import Vue from 'vue';
import SettingModel from '@/models/Setting';

class SettingStorage {
  private state = Vue.observable({
    userRegistrationDisabled: false
  });

  public getUserRegistrationDisabled () {
    return this.state.userRegistrationDisabled;
  }

  public async fetchFrontSettings () {
    try {
      const { data } = await SettingModel.getFrontCollection();
      if (data['userRegistrationDisabled'] && data['userRegistrationDisabled'].value === '1') {
        this.state.userRegistrationDisabled = true;
      } else {
        this.state.userRegistrationDisabled = false;
      }
    } catch (err) {}
  }
}

export default new SettingStorage();
