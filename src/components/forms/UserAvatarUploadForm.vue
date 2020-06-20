<template>
  <form @submit.prevent="updateAvatar">
    <b-alert variant="primary" dismissible :show="!!formUploadUserAvatar.statusText">
      {{ formUploadUserAvatar.statusText }}
    </b-alert>

    <div class="form-group">
      <b-form-file
        v-model="avatarFile"
        :state="Boolean(avatarFile)"
        placeholder="Выберите изображение"
        drop-placeholder="Скинте изображение сюда.."
        accept="image/jpeg, image/png"
      ></b-form-file>
    </div>

    <div class="form-group">
      <button
        class="btn btn-success"
        type="submit"
        v-bind:disabled="formUploadUserAvatar.busy"
      >Обновить</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel from '../../models/User';

export default defineComponent({
  setup (props, { root }) {
    const avatarFile = ref<Blob>(new Blob());
    const formUploadUserAvatar = ref(UserModel.formUploadUserAvatar());

    async function updateAvatar () {
      if (avatarFile.value) {
        formUploadUserAvatar.value.model.avatarFile = avatarFile.value;
        try {
          const { data } = await formUploadUserAvatar.value.submit();
        } catch (error) {
          console.error(error);
        }
        root.$store.dispatch('auth/fetchUser');
        formUploadUserAvatar.value.statusText = 'Аватар изменён'
      }
    }

    return {
      avatarFile,
      formUploadUserAvatar,
      updateAvatar
    }
  }
});
</script>
