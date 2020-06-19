import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// import { } from '@fortawesome/free-regular-svg-icons'

import {
  faUser, faEnvelope, faLock, faBars
} from '@fortawesome/free-solid-svg-icons';

import {

} from '@fortawesome/free-brands-svg-icons';

library.add(
  faUser, faEnvelope, faLock, faBars
);

Vue.component('fa', FontAwesomeIcon);
