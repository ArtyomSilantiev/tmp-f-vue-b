<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import store from '@/store';
import router from '@/router';

export default defineComponent({
  setup (props: any, { root }) {
    onMounted(async () => {
      await store.dispatch('auth/logout');
      router.replace({ name: 'main' });
    });
    return {};
  }
});
</script>
