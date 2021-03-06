<template>
  <div>
    <div v-if="!isDone">
      <form @submit.prevent="updateSettings">
        <!-- First Name -->
        <b-form-group>
          <b-form-input
            v-model="form.model.firstName"
            type="text"
            name="firstName"
            :class="{ 'is-invalid': form.hasErrorField('firstName') }"
            v-bind:placeholder="$t('labels.firstName')"
            :disabled="!!user.firstName"
          />
          <b-form-invalid-feedback>
            <span v-for="error in form.getFieldErrors('firstName', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
            </span>
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Last Name -->
        <b-form-group>
          <b-form-input
            v-model="form.model.lastName"
            type="text"
            name="lastName"
            :class="{ 'is-invalid': form.hasErrorField('lastName') }"
            v-bind:placeholder="$t('labels.lastName')"
            :disabled="!!user.lastName"
          />
          <b-form-invalid-feedback>
            <span v-for="error in form.getFieldErrors('lastName', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
            </span>
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Button -->
        <b-form-group>
          <b-button
            variant="success"
            type="submit"
            v-bind:disabled="form.busy"
          >Обновить данные</b-button>
        </b-form-group>
      </form>
    </div>
    <div class="text-center" v-else>
      Данные обновлены
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel, { FormUserSettingsUpdate } from '../../models/User';
import AuthStorage from '@/storages/Auth';

export default defineComponent({
  setup (props, { root }) {
    const form = ref(new FormUserSettingsUpdate());
    const isDone = ref(false);
    const user = ref<UserModel>({});

    onMounted(async () => {
      const _user = AuthStorage.getUser();
      if (_user) {
        user.value = _user;
      }
    });

    async function updateSettings () {
      try {
        await form.value.submit();
        await AuthStorage.fetchUser();
        isDone.value = true;
      } catch (error) {}
    }

    function reset () {
      form.value.clearErrors();
      form.value.model.firstName = user.value.firstName || '';
      form.value.model.lastName = user.value.lastName || '';
      isDone.value = false;
    }

    return {
      form,
      updateSettings,
      isDone,
      reset,
      user
    }
  }
});
</script>
