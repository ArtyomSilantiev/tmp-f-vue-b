<template>
  <div class="wrapper" :class="{ 'sidebar-collapse': sidebarIsColapse }">
    <div v-if="isAuth">
      <aside
          class="main-sidebar elevation-4"
          ref="sideMenu"
        >
        <!-- Brand Logo -->
        <a href="#" class="brand-link">
          <img class="brand-image img-circle" src="/images/default-avatar.jpg">
          <span class="brand-text font-weight-light">ProjectTmpX2</span>
        </a>
        <!-- Sidebar -->
        <VueCustomScrollbar class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img :src="user.avatar ? user.avatar : '/images/default-avatar.jpg'" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
              <router-link :to="{ name: 'home' }" class="d-block">
                {{ user.firstName ? user.firstName : '(пусто)' }} {{ user.lastName ? user.lastName : '(пусто)' }}
              </router-link>
            </div>
          </div>
          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <span v-if="isAdmin">
                <NavItemTree :text="'Администрирование'" :icon="'fas fa-user-cog'" :items="[
                  { text: 'Настройки', to: { name: 'admin.settings' }, icon: 'fas fa-wrench' },
                  { text: 'Пользователи', to: { name: 'admin.users' }, icon: 'ion ion-md-people' }
                ]" />
              </span>
            </ul>
          </nav>
        </VueCustomScrollbar>
      </aside>

      <div
        class="page-view"
        ref="pageViewRef"
      >
        <b-navbar toggleable="lg">
          <b-navbar-nav>
            <b-nav-item id="sidemenuButton" @click="sideBarMenuBtnClick()"><fa icon="bars" /></b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="logout()">Выход</b-nav-item>
          </b-navbar-nav>
        </b-navbar>

        <div class="content-wrapper">
          <router-view :key="$route.path" />
        </div>

        <div class="footer">
          <b-row>
            <b-col sm="6">
            Copyright © 2020 All rights reserved.
            </b-col>
            <b-col sm="6">

            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref, onMounted, onUnmounted, onActivated, onBeforeMount } from '@vue/composition-api';
import AuthComposition from '../compositions/Auth';

import NavItem from '../components/aside/NavItem.vue';
import NavItemTree from '../components/aside/NavItemTree.vue';
import NavHeader from '../components/aside/NavHeader.vue';
import VueCustomScrollbar from 'vue-custom-scrollbar';

export default defineComponent({
  components: {
    NavItem,
    NavItemTree,
    NavHeader,
    VueCustomScrollbar
  },

  setup (props: any, { root }) {
    const sidebarIsColapse = ref(false);
    const pageViewRef = <Ref<HTMLElement | null>>ref(null);
    const sideMenu = <Ref<HTMLElement | null>>ref(null);

    function onRiseze () {
      if (sideMenu.value) {
        sideMenu.value.style.height = window.innerHeight + 'px';
      }

      if (window.innerWidth <= 768) {
        sidebarIsColapse.value = true;
      }
    }

    function onClickToPageView (event: any) {
      for (let el of event.path) {
        if (el.id === 'sidemenuButton') {
          return;
        }
      }
      if (!sidebarIsColapse.value && window.innerWidth <= 768) {
        sidebarIsColapse.value = true;
      }
    }

    function sideBarMenuBtnClick () {
      sidebarIsColapse.value = !sidebarIsColapse.value;
      if (sidebarIsColapse.value) {
        localStorage.setItem('projectTmpX2.sidebarIsColapse', '1');
      } else {
        localStorage.setItem('projectTmpX2.sidebarIsColapse', '0');
      }
    }

    const authComposition = AuthComposition();

    onBeforeMount(() => {
      if (!authComposition.isAuth.value) {
        root.$router.replace({ name: 'login' });
      }
    });

    onMounted(() => {
      if (!authComposition.isAuth.value) {
        return;
      }
      if (localStorage.getItem('projectTmpX2.sidebarIsColapse') === '1') {
        sidebarIsColapse.value = true;
      }
      onRiseze();
      window.addEventListener('resize', onRiseze);
      if (pageViewRef.value) {
        pageViewRef.value.addEventListener('click', onClickToPageView);
      }
    });

    onUnmounted(() => {
      try {
        window.removeEventListener('resize', onRiseze);
        if (pageViewRef.value && pageViewRef.value.removeEventListener) {
          pageViewRef.value.removeEventListener('click', onClickToPageView);
        }
      } catch (error) {}
    });

    return Object.assign(authComposition, {
      sidebarIsColapse,
      pageViewRef,
      sideMenu,
      sideBarMenuBtnClick
    });
  }
});
</script>

<style lang="scss">
.wrapper {
  position: relative;
  min-height: 100%;

  .main-sidebar {
    user-select: none;
    height: inherit;
    min-height: 100%;
    position: absolute;
    top: 0;
    position: fixed;
    background-color: #343a40;
    z-index: 1044;
    width: 250px;
    transition: width .3s ease-in-out, margin-left .3s ease-in-out;

    @media (max-width: 768px) {
      width: 250px;
      margin-left: 0px;
    }

    .brand-link {
      display: block;
      font-size: 1.25rem;
      line-height: 1.5;
      padding: 0.8125rem 0.5rem;
      transition: width 0.3s ease-in-out;
      white-space: nowrap;
      border-bottom: 1px solid #4b545c;
      color: rgba(255,255,255,.8);

      .brand-image {
          float: left;
          line-height: .8;
          margin-left: .8rem;
          margin-right: .5rem;
          margin-top: -3px;
          max-height: 33px;
          width: auto;
      }

      .brand-text {
        transition: margin-left .3s linear, opacity .3s ease, visibility .3s ease;
        &:hover {
          color: #fff;
        }
      }
    }

    .sidebar {
      height: calc(100% - 4rem);
      overflow-y: auto;
      padding-bottom: 0;
      padding-left: .5rem;
      padding-right: .5rem;
      padding-top: 0;

      .user-panel {
        border-bottom: 1px solid #4f5962;

        .image {
          display: inline-block;
          padding-left: .8rem;

          img {
            height: 33px;
            width: 33px;
          }
        }

        .info {
          transition: margin-left .3s linear, opacity .3s ease, visibility .3s ease;
          display: inline-block;
          padding: 5px 5px 5px 10px;
          overflow: hidden;
          white-space: nowrap;

          a {
            color: #c2c7d0;
            &:hover {
              color: #fff;
            }
          }
        }
      }

      .nav-sidebar {
        white-space: nowrap;
        overflow: hidden;
        position: relative;

        .nav-item {
          margin-bottom: 0;
          white-space: nowrap;
          text-align: left;

          .nav-link {
            cursor: pointer;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            margin-bottom: .2rem;
            border-radius: .25rem;
            color: #c2c7d0;

            .nav-icon {
              font-size: 1.1rem;
              width: 1.6rem;
              margin-right: .2rem;
              text-align: center;
            }

            i {
              transition: transform ease-in-out .3s;
            }

            p {
              transition: margin-left .3s linear, opacity .3s ease, visibility .3s ease;
              display: inline-block;
              margin: 0;

              .right {
                  position: absolute;
                  right: 1rem;
                  top: .7rem;
              }
            }

            &:hover {
              color: #fff;
            }

            &.active {
              background-color: #007bff;
              color: #fff;
              box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);

              &.is-sub {
                background-color: rgba(255,255,255,.9);
                color: #343a40;
              }
            }
          }

          &.has-treeview {
            &.menu-open {
              i.right {
                transform: rotate(-90deg);
              }
            }
          }
        }

        .nav-header {
          background: inherit;
          color: #d0d4db;
          padding: 1.7rem 1rem .5rem;
        }
      }
    }

    &.elevation-4 {
      box-shadow: 0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22)!important;
    }
  }

  .page-view {
    margin-left: 250px;
    transition: margin-left .3s ease-in-out;

    .content-wrapper {
      background-color: #f4f6f9;
      padding: 10px 5px;
      min-width: 100%;
    }

    @media (max-width: 768px) {
      margin-left: 0px;
    }

    .footer {
      background: #fff;
      border-top: 1px solid #dee2e6;
      color: #869099;
      padding: 1rem;
    }
  }

  &.sidebar-collapse {
    .main-sidebar:not(.mouse-over) {
      width: 73px;

      @media (max-width: 768px) {
        box-shadow: none!important;
        margin-left: -250px;
      }

      @media (min-width: 769px) {
        .brand-text {
          margin-left: -10px;
          opacity: 0;
          visibility: hidden;
        }

        .user-panel {
          .info {
            margin-left: -10px;
            opacity: 0;
            visibility: hidden;
          }
        }

        .nav-sidebar {
          .nav-item {
            text-align: initial;
            .nav-link {
              p {
                margin-left: -10px;
                opacity: 0;
                visibility: hidden;
                width: 0;
                display: inline-block;
              }
            }
          }

          .nav-header {
            display: none;
          }
        }
      }
    }

    .page-view {
      margin-left: 73px;

      @media (max-width: 768px) {
        margin-left: 0px;
      }
    }
  }
}
</style>
