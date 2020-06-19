<template>
  <div id="app">
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from '@vue/composition-api';
import NavbarComponent from './components/Navbar.vue';
import { layouts } from './lib/layouts';

export default defineComponent({
  components: {
    NavbarComponent
  },

  setup (props: any, { root }) {
    const layout = ref(null);
    const defaultLayout = 'default';

    onMounted(async () => {
      await root.$store.dispatch('setting/fetchFrontSettings');
    });

    function setLayout (argLayout?: string) {
      if (!argLayout || !layouts[argLayout]) {
        argLayout = defaultLayout;
      }

      layout.value = layouts[argLayout];
    }

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

    return {
      layout,
      setLayout
    };
  }
});
</script>

<style lang="scss">
</style>
