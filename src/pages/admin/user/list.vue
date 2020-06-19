<template>
  <div class="admin-users-list-page container-fluid">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Пользователи</h1>
          </div>
          <div class="col-sm-6">
            <b-breadcrumb :items="[
              {
                text: 'Дом',
                to: { name: 'home' }
              }, {
                text: 'Пользователи',
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
          <div>
            <form @submit.prevent="searchSubmit">
              <b-button v-b-toggle.filtres variant="success">Фильтры</b-button>
              <b-collapse id="filtres">
                <!-- ID -->
                <b-row class="mt-2">
                  <b-col sm="4">
                    <label for="filter-id">ID</label>
                  </b-col>
                  <b-col sm="8">
                    <b-form-input id="filter-id" type='text' v-model="params.id"></b-form-input>
                  </b-col>
                </b-row>
                <!-- Email -->
                <b-row class="mt-2">
                  <b-col sm="4">
                    <label for="filter-email">Email</label>
                  </b-col>
                  <b-col sm="8">
                    <b-form-input id="filter-email" type='text' v-model="params.email"></b-form-input>
                  </b-col>
                </b-row>
                <!-- Role -->
                <b-row class="mt-2">
                  <b-col sm="4">
                    <label for="filter-role">Роль</label>
                  </b-col>
                  <b-col sm="8">
                    <b-form-select v-model="params.role" :options="[
                      { value: null, text: '-- Роль --' },
                      { value: 'user', text: $t('userRoles.user') },
                      { value: 'admin', text: $t('userRoles.admin') }
                    ]"></b-form-select>
                  </b-col>
                </b-row>
                <!-- Name -->
                <b-row class="mt-2">
                  <b-col sm="4">
                    <label for="filter-name">Имя</label>
                  </b-col>
                  <b-col sm="8">
                    <b-form-input id="filter-name" type='text' v-model="params.name"></b-form-input>
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-button class="mr-2" @click="filtresReset">Сброс</b-button>
                  <b-button type="submit" variant="primary">Поиск</b-button>
                </b-row>
              </b-collapse>
            </form>
          </div>

          <div class="row mt-3">
            <b-table
              responsive
              :fields="fields"
              :items="fetch"
              :per-page="params.pageSize"
              :current-page="params.page"
              :busy.sync="isBusy"
              ref="tableRef"
            >
              <template v-slot:cell(role)="data">
                {{ $t('userRoles.' + data.item.role) }}
              </template>

              <template v-slot:cell(name)="data">
                {{ (data.item.firstName || '(пусто)') + ' ' + (data.item.lastName || '(пусто)') }}
              </template>

              <template v-slot:cell(createdAt)="data">
                {{ moment(data.item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
              </template>

              <template v-slot:cell(actions)="data">
                <b-button
                  variant="outline-primary"
                  :to="{ name: 'admin.settings.item', params: { name: data.item.name} }"
                >Редактирование</b-button>
              </template>
            </b-table>
          </div>

          <div class="row">
            <div class="col-md-6">
              Показаны записи с {{ (params.page - 1) * params.pageSize + 1 }} по {{ ((params.page - 1) * params.pageSize) + rows.length }} из {{ totalRows }}
            </div>
            <div class="cold-md-6 grid-col-right-md">
              <b-pagination
                v-model="params.page"
                :total-rows="totalRows"
                :per-page="params.pageSize"
                class="my-0"
              ></b-pagination>
            </div>
          </div>
        </b-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel, { UserRole, IUserFetchParams } from '../../../models/User';

export default defineComponent({
  layout: 'aside',
  middleware: ['is-admin'],

  setup (props: any, { root }) {
    const fields = ref([
      {
        key: 'id',
        label: 'ID',
        sortable: true
      }, {
        key: 'role',
        label: 'Роль',
        sortable: true
      }, {
        key: 'email',
        label: 'Email',
        sortable: true
      }, {
        key: 'name',
        label: 'Имя'
      }, {
        key: 'createdAt',
        label: 'Зарегистрирован',
        sortable: true
      }
    ]);
    const tableRef = ref<any>({});
    const rows = ref<UserModel[]>([]);
    const totalRows = ref(0);
    const isBusy = ref(false);
    const params = ref<IUserFetchParams>({
      page: 1,
      pageSize: 20,
      sortBy: null,
      sortDesc: null,
      id: null,
      role: null,
      email: null,
      name: null
    });

    onMounted(async function () {
      params.value.page = typeof root.$route.query.page === 'string' ? parseInt(root.$route.query.page) : 1;
      params.value.pageSize = typeof root.$route.query.pageSize === 'string' ? parseInt(root.$route.query.pageSize) : 20;
      params.value.sortBy = typeof root.$route.query.sortBy === 'string' ? root.$route.query.sortBy : null;
      params.value.sortDesc = typeof root.$route.query.sortDesc === 'string' ? root.$route.query.sortDesc : null;
      params.value.id = typeof root.$route.query.id === 'string' ? root.$route.query.id : null;
      params.value.role = typeof root.$route.query.role === 'string' ? root.$route.query.role : null;
      params.value.email = typeof root.$route.query.email === 'string' ? root.$route.query.email : null;
      params.value.name = typeof root.$route.query.name === 'string' ? root.$route.query.name : null;
    });

    async function fetch (ctx: any) {
      params.value.page = ctx.currentPage;
      params.value.pageSize = ctx.perPage;
      params.value.sortBy = ctx.sortBy;
      params.value.sortDesc = ctx.sortDesc;

      isBusy.value = true;
      const { data } = await UserModel.adminFetchUsers(params.value);
      rows.value = data.rows;
      totalRows.value = data.totalRows;
      isBusy.value = false;

      updateRouteUrl(params.value);

      return rows.value;
    }

    function updateRouteUrl (query: any) {
      let obj = Object.assign({}, root.$route.query);

      Object.keys(query).forEach(key => {
        let value = query[key];

        if (value) {
          obj[key] = value + '';
        } else {
          delete obj[key];
        }

        if (['id', 'email', 'role'].indexOf(key) !== -1 && !value) {
          delete obj[key];
        }
      });

      try {
        if (JSON.stringify(obj) !== JSON.stringify(root.$route.query)) {
          root.$router.replace({
            ...root.$router.currentRoute,
            name: root.$router.currentRoute.name || '',
            query: obj
          });
        }
      } catch (e) {}
    }

    async function searchSubmit () {
      tableRef.value.refresh();
    }

    function filtresReset () {
      params.value.id = null;
      params.value.role = null;
      params.value.email = null;
      params.value.name = null;
    }

    return {
      tableRef,
      fields,
      rows,
      totalRows,
      params,
      fetch,
      isBusy,
      filtresReset,
      searchSubmit
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
