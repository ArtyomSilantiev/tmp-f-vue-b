<template>
  <div class="page-main container text-center">
    <div class="nav-menu mb-3">
      <router-link class="nav-link" :to="{ name: 'main' }">Главная</router-link>

      <span v-if="!isAuth">
        <router-link class="nav-link" :to="{ name: 'login' }">Логин</router-link>
        <router-link class="nav-link" :to="{ name: 'register' }">Регистрация</router-link>
      </span>

      <span v-if="isAuth">
        <a class="nav-link" href="#" @click="logout()">Выйти из системы</a>
      </span>
    </div>

    <div class="menu mb-3">
      <div class="mt-3">
        <button class="btn btn-sm btn-info btn-block" @click="helloApi()">Send hello to api</button>
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-info btn-block" @click="sweetalert2()">{{ $t('_sweetalert2') }} show</button>
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-info btn-block" @click="addToast()">Add toast show</button>
      </div>
      <div class="mt-3">
        <button
          class="btn btn-sm btn-info btn-block"
          @click="openModal()"
          mdbWavesEffect
        >Open Modal</button>
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-info btn-block" @click="toogleFullScreen()">Toggle fullscreen</button>
      </div>
    </div>

    <b-card class="mb-3">
      <h4>Текущий пользователь:</h4>
      <div v-if="isAuth">
        <br />Вы ауторизированы!
        <br />
        Id: {{ user.id }}<br />
        Email: {{ user.email }}<br />
        Email {{ user.isActivated ? 'активирован' : 'не активирован'}}
      </div>
      <div v-if="!isAuth">
        <br />Вы не авторизированный пользователь.
      </div>
    </b-card>

    <b-modal ref="myModal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From My Modal!</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
      <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import axios from 'axios';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import i18n from '../lib/i18n';
import AuthComposition from '../compositions/Auth';
import { BModal } from 'bootstrap-vue'

export default defineComponent({
  setup (props: any, { root }) {
    const fullScreen = ref(false);

    onMounted(() => {
    });

    async function helloApi () {
      const responce = await axios.get('/api/hello');
      console.log(responce.data.message);
    }

    async function sweetalert2 () {
      Swal.fire({
        icon: 'success',
        title: root.$t('labels.errorAlertTitle'),
        text: root.$t('labels.errorAlertText'),
        reverseButtons: true,
        confirmButtonText: root.$t('labels.ok'),
        cancelButtonText: root.$t('labels.cancel')
      } as SweetAlertOptions);
    }

    let toastCounter = 0;
    function addToast () {
      toastCounter++;
      root.$bvToast.toast(`This is toast number ${toastCounter}`, {
        title: 'BootstrapVue Toast',
        autoHideDelay: 5000,
        appendToast: true
      })
    }

    function modalComposition () {
      const myModal = ref(new BModal());
      return {
        myModal,
        async openModal () {
          myModal.value.show();
        },
        hideModal () {
          myModal.value.hide();
        },
        toggleModal () {
          myModal.value.toggle();
        }
      }
    }

    function toogleFullScreen () {
      if (!fullScreen.value) {
        const element: any = document.documentElement;

        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }

        fullScreen.value = true;
      } else {
        const document: any = window.document;

        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        fullScreen.value = false;
      }
    }

    const authComposition = AuthComposition();

    return Object.assign(authComposition, modalComposition(), {
      helloApi,
      sweetalert2,
      addToast,
      toogleFullScreen
    });
  }
});
</script>
