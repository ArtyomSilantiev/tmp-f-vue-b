<template>
  <div class="user-page">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Профиль</h1>
          </div>
          <div class="col-sm-6">
            <b-breadcrumb :items="[
              {
                text: 'Кабинет',
                active: true
              }
            ]"></b-breadcrumb>
          </div>
        </div>
      </div>
    </section>

    <section class="content-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-4">
            <b-card class="text-center">
              <img
                class="profile-user-img img-circle"
                :src="user.avatar ? user.avatar : '/images/default-avatar.jpg'"
              />
              <div class="mt-1 mb-1" v-if="isOwner">
                <b-button @click="updateAvatarModalRef.show()" variant="primary">Изменить аватар</b-button>
              </div>
              <h3
                class="profile-username"
              >{{ user.firstName ? user.firstName : '(пусто)' }} {{ user.lastName ? user.lastName : '(пусто)' }}</h3>
            </b-card>
          </div>

          <div class="col-md-8">
            <b-card>
              <b-tabs content-class="mt-3">
                <!-- Information -->
                <b-tab title="Информация" active>
                  <b-row class="mt-2">
                    <b-col sm=4>
                      <b>ID</b>
                    </b-col>
                    <b-col sm=8>
                      {{ user.id }}
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col sm=4>
                      <b>Email</b>
                    </b-col>
                    <b-col sm=8 >
                      {{ user.email }}
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col sm=4>
                      <b>Населённый пункт</b>
                    </b-col>
                    <b-col sm=8 >
                      {{ user.city }}
                    </b-col>
                  </b-row>
                </b-tab>
                <!-- Edit -->
                <b-tab title="Редактирование" v-if="isOwner" @click="userSettingsChangeFormRef.reset()">
                  <UserSettingsChangeForm ref="userSettingsChangeFormRef" class="mt-2" />
                </b-tab>
                <!-- Change password -->
                <b-tab title="Изменить пароль" v-if="isOwner" @click="userPasswordChangeFormRef.reset()">
                  <UserPasswordChangeForm ref="userPasswordChangeFormRef" />
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </div>
      </div>
    </section>

    <b-modal ref="updateAvatarModalRef" hide-footer title="Обновление аватара">
      <UserAvatarUploadForm />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api';
import UserModel from '../../models/User';
import { BModal } from 'bootstrap-vue'
import UserAvatarUploadForm from '../../components/forms/UserAvatarUploadForm.vue';
import UserSettingsChangeForm from '../../components/forms/UserSettingsChangeForm.vue';
import UserPasswordChangeForm from '../../components/forms/UserPasswordChangeForm.vue';
import AuthStorage from '@/storages/Auth';

export default defineComponent({
  components: {
    UserAvatarUploadForm,
    UserSettingsChangeForm,
    UserPasswordChangeForm
  },

  setup (props: any, { root }) {
    let userId = root.$route.params['id'] || null;
    const user = ref({} as UserModel);
    const isOwner = ref(false);
    const updateAvatarModalRef = ref<BModal>(new BModal());
    const userSettingsChangeFormRef = ref<any>(null);
    const userPasswordChangeFormRef = ref<any>(null);

    onMounted(async function () {
      const selfUser = AuthStorage.getUser();
      if (!userId && selfUser && selfUser.id) {
        userId = selfUser.id;
      }
      if (selfUser && selfUser.id === userId) {
        user.value = selfUser;
        isOwner.value = true;
        if (updateAvatarModalRef.value) {
          updateAvatarModalRef.value.hide();
        }
      } else if (userId) {
        const { data } = await UserModel.getById(userId);
        user.value = data;
        isOwner.value = false;
      }
    });

    return {
      user,
      isOwner,
      updateAvatarModalRef,
      userSettingsChangeFormRef,
      userPasswordChangeFormRef
    };
  }
});
</script>

<style lang="scss" scoped>
.profile-username {
  font-size: 21px;
  margin-top: 5px;
}

.profile-user-img {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  padding: 3px;
  border: 3px solid #d2d6de;
}
</style>
