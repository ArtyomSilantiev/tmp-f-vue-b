<template>
  <div class="admin-settings-page container-fluid">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Настройки</h1>
          </div>
          <div class="col-sm-6">
            <b-breadcrumb :items="[
              {
                text: 'Дом',
                to: { name: 'home' }
              }, {
                text: 'Настройки',
                active: true
              }
            ]"></b-breadcrumb>
          </div>
        </div>
      </div>
    </section>

    <section class="content-body">
      <div class="container-fluid">
        <b-card>
          <b-table responsive :fields="tableFields" :items="tableItems">
            <template v-slot:cell(description)="data">
              {{ $t('settingsDescriptions.' + data.item.name) }}
            </template>

            <template v-slot:cell(actions)="data">
              <b-button
                variant="outline-primary"
                :to="{ name: 'admin.settings.item', params: { name: data.item.name} }"
              >Редактирование</b-button>
            </template>
          </b-table>
        </b-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import SettingModel from '../../../models/Setting';

export default defineComponent({
  setup (props: any, { root }) {
    const tableFields = ref([
      {
        key: 'name',
        label: 'Название',
        sortable: true
      }, {
        key: 'description',
        label: 'Описание'
      }, {
        key: 'value',
        label: 'Значение'
      }, {
        key: 'actions',
        label: 'Действия'
      }
    ]);
    const tableItems = ref<SettingModel[]>([]);

    onMounted(async function () {
      const { data } = await SettingModel.adminGetAllSettings();
      tableItems.value = data;
    });

    return {
      tableFields,
      tableItems
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
