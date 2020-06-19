<template>
  <div class="admin-settings-item-page container-fluid mt-3">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Главная</h1>
          </div>
          <div class="col-sm-6">
            <b-breadcrumb :items="[
              {
                text: 'Дом',
                to: { name: 'home' }
              }, {
                text: 'Настройки',
                to: { name: 'admin.settings' }
              }, {
                text: 'Редактирование',
                active: true
              }
            ]"></b-breadcrumb>
          </div>
        </div>
      </div>
    </section>

    <section class="content-body">
      <div class="container-fluid">
        <b-card :title="'Редактирование настройке'">
          <form @submit.prevent="save">
            <b-alert variant="primary" dismissible :show="!!form.statusText">
              {{ form.statusText }}
            </b-alert>

            <div class="row mt-4">
              <div class="col-md-4">
                <strong>Название:</strong>
              </div>
              <div class="col-md-8">
                {{ settingName }}
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-md-4">
                <strong>Описание:</strong>
              </div>
              <div class="col-md-8">
                {{ $t('settingsDescriptions.' + settingData.name) }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <strong>Значение:</strong>
              </div>
              <div class="col-md-8">
                <span v-if="settingData.type === 'bool'">
                  <toggle-button :value="settingData.value === '1'" @change="boolChange" />
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 text-center">
                <b-button variant="outline-primary" type="submit" :disabled="form.busy">
                  Сохранить
                </b-button>
              </div>
            </div>
          </form>
        </b-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import SettingModel from '../../../models/Setting';
import Form from '../../../lib/form';

export default defineComponent({
  layout: 'aside',
  middleware: ['is-admin'],

  setup (props: any, { root }) {
    const settingName = ref(root.$route.params['name']);
    const settingData = ref<SettingModel>(new SettingModel());
    const form = ref<Form<{
      name: string;
      value: string;
    }>>(SettingModel.formAdminChangeSetting());

    onMounted(async function () {
      const { data } = await SettingModel.adminGetSettingByName(settingName.value);
      settingData.value = data;
    });

    const boolChange = () => {
      if (settingData.value.value === '1') {
        settingData.value.value = '0';
      } else {
        settingData.value.value = '1';
      }
    };

    const save = async () => {
      if (settingData.value.value) {
        form.value.model.name = settingName.value;
        form.value.model.value = settingData.value.value;
        await form.value.submit();
        form.value.statusText = 'Настройка изменена.';
      }
    };

    return {
      settingName,
      settingData,
      save,
      boolChange,
      form
    };
  }
});
</script>

<style lang="scss" scoped>
.row ~ .row {
  margin-top: 20px;
}
</style>
