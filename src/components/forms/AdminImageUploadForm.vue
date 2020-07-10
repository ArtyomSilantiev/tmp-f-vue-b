<template>
  <form @submit.prevent="uploadImage">
    <b-alert variant="primary" dismissible :show="!!form.statusText">
      {{ form.statusText }}
    </b-alert>

    <div class="form-group">
      <b-form-file
        v-model="imageFile"
        :state="Boolean(imageFile)"
        placeholder="Выберите изображение"
        drop-placeholder="Скинте изображение сюда.."
        accept="image/jpeg, image/png"
      ></b-form-file>
    </div>

    <div class="form-group">
      <button
        class="btn btn-success btn-block"
        type="submit"
        v-bind:disabled="form.busy"
      >Загрузить</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import ImageModel, { FormAdminFormUploadImage } from '../../models/Image';

export default defineComponent({
  setup (props, { root, emit }) {
    const imageFile = ref<Blob>(new Blob());
    const form = ref(new FormAdminFormUploadImage());

    async function uploadImage () {
      if (imageFile.value) {
        form.value.model.imageFile = imageFile.value;
        try {
          const { data } = await form.value.submit();
          form.value.statusText = 'Изображение загружено';
          emit('upload', data);
        } catch (error) {
          console.error(error);
        }
      }
    }

    return {
      imageFile,
      form,
      uploadImage
    }
  }
});
</script>
