import { computed, ref, onMounted } from '@vue/composition-api';
import store from '../store';

export default function SettingsFrontComposition () {
  const userRegistrationDisabled = computed(() => {
    return store.getters['setting/userRegistrationDisabled'];
  });

  return {
    userRegistrationDisabled
  };
}
