<template>
  <div class="page-auth-login container mt-3">
    <div class="site-form form-login text-center">
      <h4>Авторизация</h4>

      <b-alert
        variant="danger"
        dismissible
        :show="!!form.errorText"
      >{{ form.errorText }}</b-alert>

      <form @submit.prevent="login">
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
          <div
            class="field-error"
            v-for="error in form.getFieldErrors('password', true)"
            :key="error"
          >{{ $t('formsErrors.' + error) }}</div>
        </div>

        <div class="input-group">
          <div>
            <router-link
              :to="{ name: 'password.request' }"
              class="small ml-auto my-auto"
            >{{ $t('labels.forgotPassword') }}</router-link>
          </div>
        </div>

        <div class="input-group" v-if="!userRegistrationDisabled">
          <div class="text-center">
            Или вы можете
            <b-link :to="{ name: 'register' }">зарегистрироваться.</b-link>
          </div>
        </div>

        <div class="input-group">
          <button
            class="btn btn-success"
            type="submit"
            v-bind:disabled="form.busy"
          >{{ $t('labels.login') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import UserModel, { FormUserLogin } from '../../models/User';
import axios from 'axios';
import SettingsFrontComposition from '../../compositions/SettingsFront';
import AuthStorage from '@/storages/Auth';

export default defineComponent({
  setup (props: any, { root }) {
    const form = ref(new FormUserLogin());

    async function login () {
      try {
        const { data } = await form.value.submit();
        AuthStorage.setToken(data.token);
        root.$router.push({ name: 'main' });
      } catch (err) { }
    }

    return Object.assign(
      SettingsFrontComposition(),
      {
        form,
        login
      }
    );
  }
});
</script>
