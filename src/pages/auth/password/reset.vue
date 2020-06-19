<template>
  <div class="page-auth-password-reset container mt-3">
    <b-alert variant="primary" dismissible :show="!!form.statusText">
      {{ form.statusText }}
    </b-alert>

    <b-alert variant="danger" dismissible :show="!!form.errorText">
      {{ form.errorText }}
    </b-alert>

    <div class="text-center" v-if="!isLoadng">
      <b-spinner label="Загрузка..."></b-spinner>
    </div>

    <div v-else-if="!hideForm" class="site-form form-password-reset text-center">
      <h4>Изменение пароля для {{ email }}</h4>

      <form @submit.prevent="resetPassword">
        <!-- Password -->
        <div class="input-group">
          <input
            v-model="form.model.password"
            type="password"
            name="password"
            :class="{ 'is-invalid': form.hasErrorField('password') }"
            class="form-control"
            v-bind:placeholder="$t('labels.password')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="lock" />
            </div>
          </div>
          <div class="field-error" v-for="error in form.getFieldErrors('password', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
          </div>
        </div>

        <!-- Password Confirmation -->
        <div class="input-group">
          <input
            v-model="form.model.passwordConfirmation" type="password" name="passwordConfirmation"
            :class="{ 'is-invalid': form.hasErrorField('passwordConfirmation') }" class="form-control"
            v-bind:placeholder="$t('labels.passwordConfirmation')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="lock" />
            </div>
          </div>
          <div class="field-error" v-for="error in form.getFieldErrors('passwordConfirmation', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
          </div>
        </div>

        <div class="input-group">
          <button class="btn btn-success" type="submit" v-bind:disabled="form.busy">{{ $t('labels.send') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel from '../../../models/User';
import axios from 'axios';

export default defineComponent({
  setup (props: any, { root }) {
    const isLoadng = ref(false);
    const hideForm = ref(true);
    const email = ref('');
    const form = ref(UserModel.formResetPassword());

    async function resetPassword () {
      try {
        const { data } = await form.value.submit();
        form.value.statusText = 'Пароль был измененён';
        hideForm.value = true;
      } catch (err) {
        form.value.errorText = 'Не удалось изменить пароль';
        hideForm.value = true;
      }
    }

    onMounted(async () => {
      let resetCode = root.$route.params['resetCode'];

      if (!resetCode) {
        return root.$router.push({ name: 'main' });
      }

      try {
        const { data } = await UserModel.getResedPasswordCodeInfo(resetCode);
        form.value.model.resetPasswordCode = resetCode;
        email.value = data.email;
      } catch (error) {
        form.value.errorText = 'Устаревшая или не правильная ссылка для изменения пароля';
        isLoadng.value = true;
        return;
      }

      hideForm.value = false;
      isLoadng.value = true;
    });

    return {
      isLoadng,
      hideForm,
      email,
      form,
      resetPassword
    };
  }
});
</script>
