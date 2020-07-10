<template>
  <div>
    <div v-if="!isDone">
      <form @submit.prevent="changePassword">
        <!-- Old Password -->
        <div class="input-group">
          <input
            v-model="form.model.oldPassword"
            type="password"
            name="oldPassword"
            :class="{ 'is-invalid': form.hasErrorField('oldPassword') }"
            class="form-control"
            v-bind:placeholder="$t('labels.oldPassword')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="lock" />
            </div>
          </div>
          <b-form-invalid-feedback>
            <span v-for="error in form.getFieldErrors('oldPassword', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
            </span>
          </b-form-invalid-feedback>
        </div>

        <!-- New assword -->
        <div class="input-group mt-2">
          <input
            v-model="form.model.newPassword"
            type="password"
            name="newPassword"
            :class="{ 'is-invalid': form.hasErrorField('newPassword') }"
            class="form-control"
            v-bind:placeholder="$t('labels.newPassword')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="lock" />
            </div>
          </div>
          <b-form-invalid-feedback>
            <span v-for="error in form.getFieldErrors('newPassword', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
            </span>
          </b-form-invalid-feedback>
        </div>

        <!-- New Password Confirmation -->
        <div class="input-group mt-2">
          <input
            v-model="form.model.newPasswordConfirmation"
            type="password"
            name="newPasswordConfirmation"
            :class="{ 'is-invalid': form.hasErrorField('newPasswordConfirmation') }"
            class="form-control"
            v-bind:placeholder="$t('labels.newPasswordConfirmation')"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <fa icon="lock" />
            </div>
          </div>
          <b-form-invalid-feedback>
            <span v-for="error in form.getFieldErrors('newPasswordConfirmation', true)" :key="error">
              {{ $t('formsErrors.' + error) }}
            </span>
          </b-form-invalid-feedback>
        </div>

        <div class="form-group mt-2">
          <button
            class="btn btn-success"
            type="submit"
            v-bind:disabled="form.busy"
          >Изменить пароль</button>
        </div>
      </form>
    </div>
    <div class="text-center" v-else>
      Пароль изменён
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel, { FormUserPasswordChange} from '../../models/User';

export default defineComponent({
  setup (props, { root }) {
    const form = ref(new FormUserPasswordChange());
    const isDone = ref(false);

    async function changePassword () {
      try {
        await form.value.submit();
        isDone.value = true;
      } catch (error) {}
    }

    function reset () {
      form.value.clearErrors();
      form.value.model.oldPassword = '';
      form.value.model.newPassword = '';
      form.value.model.newPasswordConfirmation = '';
      isDone.value = false;
    }

    return {
      form,
      changePassword,
      isDone,
      reset
    }
  }
});
</script>
