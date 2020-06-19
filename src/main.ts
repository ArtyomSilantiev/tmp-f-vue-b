import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './lib/i18n';
import VueCompositionApi from '@vue/composition-api';
import BootstrapVue from 'bootstrap-vue'
import './assets/styles/main.scss';
import './lib';
import ToggleButton from 'vue-js-toggle-button'
import moment from 'moment';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(BootstrapVue);
Vue.use(ToggleButton);
Vue.prototype.moment = moment;
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
