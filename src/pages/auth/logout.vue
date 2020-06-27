<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import router from '@/router';
import AuthStorage from '@/storages/Auth';

export default defineComponent({
  setup (props: any, { root }) {
    onMounted(async () => {
      await AuthStorage.logout();
      router.replace({ name: 'main' });
    });
    return {};
  }
});
</script>
