<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'main' }">App</router-link>

      <button
        class="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        @click="navBarShow=!navBarShow"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        v-bind:class="{'show': navBarShow}"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }" active-class="active">Главная</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-if="!isAuth">
            <router-link class="nav-link" :to="{ name: 'login' }" active-class="active">Логин</router-link>
          </li>
          <li class="nav-item" v-if="!isAuth && !userRegistrationDisabled">
            <router-link class="nav-link" :to="{ name: 'register' }" active-class="active">Регистрация</router-link>
          </li>

          <li class="nav-item" v-if="isAuth">
            <router-link class="nav-link" :to="{ name: 'logout' }">Выйти из системы</router-link>
          </li>
          <li class="nav-item" v-if="isAuth">
            <router-link
              class="nav-link"
              :to="{ name: 'user', params: {id: user.id} }"
              active-class="active"
            >Мой кабинет</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import AuthComposition from '../compositions/Auth';
import SettingsFrontComposition from '../compositions/SettingsFront';

export default defineComponent({
  setup (props, { root }) {
    const navBarShow = ref(false);

    const authComposition = AuthComposition();
    const settingsFrontComposition = SettingsFrontComposition();

    return Object.assign(
      authComposition,
      settingsFrontComposition,
      {
        navBarShow
      }
    );
  }
});
</script>
