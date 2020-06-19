<template>
  <div>
    <navbar-component />
    <router-view :key="$route.path" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import NavbarComponent from '../components/Navbar.vue';

export default defineComponent({
  components: {
    NavbarComponent
  },

  setup (props: any, { root }) {
    return {};
  }
});
</script>
