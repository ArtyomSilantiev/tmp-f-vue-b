<template>
  <li class="nav-header">
    {{ text }}
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from '@vue/composition-api';
export default defineComponent({
  props: {
    text: String
  },
  setup () {
    return {};
  }
});
</script>
