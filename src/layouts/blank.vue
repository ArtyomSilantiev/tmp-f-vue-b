<template>
  <div>
    <router-view :key="$route.path" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
export default defineComponent({
  setup (props: any, { root }) {
    return {};
  }
});
</script>
