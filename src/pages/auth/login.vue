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
        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="form.model.email"
              :class="{ 'is-invalid': form.hasErrorField('email') }"
              type="email"
              name="email"
              v-bind:placeholder="$t('labels.email')"
            ></b-form-input>
            <b-input-group-append>
              <div class="input-group-text">
                <fa icon="envelope" />
              </div>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback :state="!form.hasErrorField('email')">
            <div
              v-for="error in form.getFieldErrors('email', true)"
              :key="error"
            >{{ $t('formsErrors.' + error) }}</div>
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Password -->
        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="form.model.password"
              :class="{ 'is-invalid': form.hasErrorField('password') }"
              type="password"
              name="password"
              v-bind:placeholder="$t('labels.password')"
            ></b-form-input>
            <b-input-group-append>
              <div class="input-group-text">
                <fa icon="lock" />
              </div>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback :state="!form.hasErrorField('password')">
            <div
              v-for="error in form.getFieldErrors('password', true)"
              :key="error"
            >{{ $t('formsErrors.' + error) }}</div>
          </b-form-invalid-feedback>
        </b-form-group>

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
        await AuthStorage.fetchUser();
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
