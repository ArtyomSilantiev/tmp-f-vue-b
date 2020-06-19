<template>
  <li class="nav-item">
    <router-link ref="routerLinkRef" :to="toParam" class="nav-link" v-bind:class="{ 'active': isActive, 'is-sub': isSubNavItem  }">
      <i class="nav-icon" :class="icon || 'fas fa-file'"></i>
      <p>{{ text }}</p>
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted, watch } from '@vue/composition-api';
import $ from 'jquery';
import { Route } from 'vue-router';
export default defineComponent({
  props: {
    id: Number,
    text: String,
    to: Object,
    icon: String,
    isSubNavItem: Boolean
  },

  setup (props: any, { root, emit }) {
    const isActive = ref(false);
    const toParam = ref(props.to || { name: 'main' });
    const routerLinkRef = ref({} as any);
    let stop = () => {};

    const testRoute = (route: Route) => {
      if (!route.name) {
        return;
      }

      const thisTo = toParam.value;
      if (route.name.indexOf(thisTo.name) !== -1) {
        if (thisTo.params) {
          for (let paramKey in thisTo.params) {
            if (!route.params[paramKey] || (thisTo.params[paramKey] + '') !== (route.params[paramKey] + '')) {
              isActive.value = false;
              emit('isActiveChange', props.id, isActive.value);
              return;
            }
            isActive.value = true;
          }
        } else {
          isActive.value = true;
        }
      } else {
        isActive.value = false;
      }
      emit('isActiveChange', props.id, isActive.value);
    }

    onMounted(() => {
      stop = watch(() => root.$route, testRoute);
      testRoute(root.$route);
    });

    onUnmounted(() => {
      stop();
    });

    return {
      isActive,
      toParam,
      routerLinkRef
    };
  }
});
</script>
