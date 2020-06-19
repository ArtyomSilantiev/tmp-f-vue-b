<template>
  <li class="nav-item has-treeview" v-bind:class="{ 'menu-open': menuIsOpen }">
    <span class="nav-link" @click="onClick()" v-bind:class="{ 'active': isActive }">
      <i class="nav-icon" :class="icon || 'fas fa-file'"></i>
      <p>{{ text }} <i class="right fas fa-angle-left"></i></p>
    </span>
    <ul ref="nevTreeVievRef" class="nav nav-treeview" style="display: none;">
      <span v-for="(item, index) in items" :key="index">
        <NavItem :text="item.text" :to="item.to" :icon="item.icon" :id="index" :isSubNavItem="true" @isActiveChange="isActiveChange" />
      </span>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from '@vue/composition-api';
import NavItem from './NavItem.vue';
import $ from 'jquery';

export default defineComponent({
  components: {
    NavItem
  },

  props: {
    text: String,
    items: Array,
    icon: String
  },

  setup (props: any) {
    const isDisplayNone = ref(true);
    const nevTreeVievRef = ref({} as HTMLElement);
    const menuIsOpen = ref(false);
    const isActive = ref(false);
    let animateProsee = false;
    let elHight = 0;

    onMounted(() => {
      let temp = $(nevTreeVievRef.value).height();
      if (typeof temp === 'number') {
        elHight = temp;
      }
    });

    async function onClick () {
      const el = nevTreeVievRef.value;

      if (animateProsee) {
        return;
      }

      if (el.style.display === 'none') {
        el.style.display = 'block';
        el.style.height = '0px';

        animateProsee = true;
        await new Promise((resolve) => {
          let timeStart = Date.now();
          let target = elHight;
          let duration = 200; // ms
          const animate = () => {
            let diff = Date.now() - timeStart;
            let height = target / (duration / diff);
            el.style.height = height + 'px';
            if (diff >= duration) {
              resolve();
            } else {
              setTimeout(animate, 1);
            }
          }
          animate();
        });
        animateProsee = false;

        menuIsOpen.value = true;
      } else {
        animateProsee = true;
        await new Promise((resolve) => {
          let timeStart = Date.now();
          let from = parseInt(el.style.height + '');
          let target = 0;
          let duration = 300; // ms
          const animate = () => {
            let diff = Date.now() - timeStart;
            let height = from - (from * (diff / duration));
            el.style.height = height + 'px';
            if (diff >= duration) {
              resolve();
            } else {
              setTimeout(animate, 1);
            }
          }
          animate();
        });
        animateProsee = false;

        el.style.display = 'none';
        menuIsOpen.value = false;
      }
    }

    function isActiveChange () {
      setTimeout(() => {
        const el = nevTreeVievRef.value;
        if ($(el).find('.active').length) {
          isActive.value = true;
        } else {
          isActive.value = false;
        }
      }, 0);
    }

    return {
      isDisplayNone,
      menuIsOpen,
      onClick,
      nevTreeVievRef,
      isActiveChange,
      isActive
    };
  }
});
</script>
