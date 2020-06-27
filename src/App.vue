<template>
  <div id="app">
    <transition name="page" mode="out-in">
      <router-view :key="$route.path" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from '@vue/composition-api';
import NavbarComponent from './components/Navbar.vue';
import SettingStorage from '@/storages/Setting';

export default defineComponent({
  components: {
    NavbarComponent
  },

  setup (props: any, { root }) {
    onMounted(async () => {
      await SettingStorage.fetchFrontSettings();
    });

    watch(
      () => root.$route,
      (route, oldRoute) => {
        let title = '';
        if (route.meta && route.meta.title) {
          const routeTitle = route.meta.title;
          if (typeof routeTitle === 'function') {
            title = routeTitle();
          } else if (typeof routeTitle === 'string') {
            title = routeTitle;
          }
        }
        if (title) {
          document.title = title + ' - Site';
        } else {
          document.title = 'Site';
        }
      }
    );
  }
});
</script>

<style lang="scss">
</style>
