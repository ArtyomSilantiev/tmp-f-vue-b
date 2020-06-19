<template>
  <div class="page-auth-register container mt-3">
    <div class="site-form form-register text-center">
      <h4>Регистрация</h4>

      <b-alert
        variant="danger"
        dismissible
        :show="!!form.errorText"
      >{{ form.errorText }}</b-alert>

      <form @submit.prevent="create">
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

        <!-- Password Confirmation -->
        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="form.model.passwordConfirmation"
              :class="{ 'is-invalid': form.hasErrorField('passwordConfirmation') }"
              type="password"
              name="passwordConfirmation"
              v-bind:placeholder="$t('labels.passwordConfirmation')"
            ></b-form-input>
            <b-input-group-append>
              <div class="input-group-text">
                <fa icon="lock" />
              </div>
            </b-input-group-append>
          </b-input-group>
          <b-form-invalid-feedback :state="!form.hasErrorField('passwordConfirmation')">
            <div
              v-for="error in form.getFieldErrors('passwordConfirmation', true)"
              :key="error"
            >{{ $t('formsErrors.' + error) }}</div>
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- google recapctha -->
          <div class="input-group" v-if="recaptchaSiteKey">
            <div class="google-recaptcha">
              <vue-recaptcha
                :sitekey="recaptchaSiteKey"
                :loadRecaptchaScript="true"
                @verify="verifyCaptcha"
                @expired="expiredCaptcha"
              ></vue-recaptcha>
            </div>
            <div
              class="field-error"
              v-for="error in form.getFieldErrors('recaptchaToken', true)"
              :key="error"
            >{{ $t('formsErrors.' + error) }}</div>
          </div>

        <div class="input-group">
          <button
            class="btn btn-success"
            type="submit"
            v-bind:disabled="form.busy"
          >{{ $t('labels.register') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import UserModel from '../../models/User';
import axios from 'axios';
import VueRecaptcha from 'vue-recaptcha';

export default defineComponent({
  components: {
    VueRecaptcha
  },

  setup (props: any, { root }) {
    const form = ref(UserModel.formCreate());
    const recaptchaSiteKey = ref(process.env.VUE_APP_GOGLE_RECAPCHA_SITE_KEY);

    function verifyCaptcha (token: string) {
      form.value.model.recaptchaToken = token;
    }

    function expiredCaptcha () {
      form.value.model.recaptchaToken = '';
    }

    async function create () {
      try {
        const { data } = await form.value.submit();
        root.$router.push({ name: 'main' });
      } catch (err) { }
    }

    return {
      form,
      create,
      verifyCaptcha,
      expiredCaptcha,
      recaptchaSiteKey
    };
  }
});
</script>
