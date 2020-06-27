import { computed, ref, onMounted } from '@vue/composition-api';
import SettingStorage from '@/storages/Setting';

export default function SettingsFrontComposition () {
  const userRegistrationDisabled = computed(() => {
    return SettingStorage.getUserRegistrationDisabled();
  });

  return {
    userRegistrationDisabled
  };
}
