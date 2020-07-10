<template>
  <div class="page-auth-request-password-reset-link container mt-3">
    <b-alert variant="primary" dismissible :show="!!form.statusText">
      {{ form.statusText }}
    </b-alert>

    <b-alert variant="danger" dismissible :show="!!form.errorText">
      {{ form.errorText }}
    </b-alert>

    <div v-if="!hideForm" class="site-form form-request-password-reset-link text-center">
      <h4>Востановление пароля</h4>

      <form @submit.prevent="requestPasswordResetLink">
        <!-- Email -->
        <div class="input-group">
          <input
            v-model="form.model.email"
            type="email"
            name="email"
            :class="{ 'is-invalid': form.hasErrorField('email') }"
            class="form-control"
            v-bind:placeholder="$t('labels.email')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="envelope" />
            </div>
          </div>
          <div
            class="field-error"
            v-for="error in form.getFieldErrors('email', true)"
            :key="error"
          >{{ $t('formsErrors.' + error) }}</div>
        </div>

        <div class="input-group">
          <button class="btn btn-success" type="submit" v-bind:disabled="form.busy">{{ $t('labels.sendPasswordResetLink') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import UserModel, { FormUserRequestPasswordResetLink } from '../../../models/User';
import axios from 'axios';

export default defineComponent({
  setup (props: any, { root }) {
    const form = ref(new FormUserRequestPasswordResetLink());
    const hideForm = ref(false);

    async function requestPasswordResetLink () {
      try {
        const { data } = await form.value.submit();
        form.value.statusText = 'Вам на почту была отправлена ссылка для сброса пароля.';
        hideForm.value = true;
      } catch (err) {}
    }

    return {
      form,
      hideForm,
      requestPasswordResetLink
    };
  }
});
</script>
