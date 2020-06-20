<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import AuthComposition from '@/compositions/Auth';
import axios from 'axios';

export default defineComponent({
  setup (props: any, { root }) {
    onMounted(async () => {
      await AuthComposition().logout();
    });
    return {};
  }
});
</script>
