import { computed, ref, onMounted } from '@vue/composition-api';
import storages from '@/storages';

export default function SettingsFrontComposition () {
  const userRegistrationDisabled = computed(() => {
    return storages.SettingStorage.getUserRegistrationDisabled();
  });

  return {
    userRegistrationDisabled
  };
}
