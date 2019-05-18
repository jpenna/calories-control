<template>
  <div class="text-center">

    <!-- Back link -->
    <div class="text-left">
      <el-link type="info" class="fs-100" :underline="false" @click="$router.go(-1)">
        <i class="el-icon-caret-left" />
        Back
      </el-link>
    </div>

    <h1 class="mb-50">Account</h1>

    <!-- Max Calories -->
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="100px"
      @submit="submitCalories"
    >
      <el-form-item label="Max Calories" class="d-inline-block">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="form.calories"
          name="calories"
        />
        <i
          :style="{ visibility: !isUpdatingAccount || 'hidden' }"
          class="ml-10 fs-150 v-align-middle"
          :class="{
            'el-icon-loading': isUpdatingAccount,
            'el-icon-success color-success': !isUpdatingAccount, // and no error
            'el-icon-error color-danger': !isUpdatingAccount, // and error
          }"
        />
      </el-form-item>
    </el-form>

    <!-- Users permissions -->
    <UsersRoles style="max-width: 650px; margin: auto" class="mb-100"/>

    <el-button type="danger" class="logout-button" @click="handleLogout">
      Logout
    </el-button>

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations } from 'vuex';

import UsersRoles from './UsersRoles.vue';

export default Vue.extend({
  name: 'Account',

  components: {
    UsersRoles,
  },

  data() {
    return {
      form: {
        calories: 0,
      },
    };
  },

  computed: {
    isUpdatingAccount() {
      return false;
    },
  },

  methods: {
    ...mapMutations('auth', ['doLogout']),

    submitCalories() {
      console.log('submit');
    },

    handleLogout() {
      this.doLogout();
    },
  },
});
</script>

<style lang="scss">
.logout-button {
  position: absolute;
  bottom: 40px;
  right: 0;
  left: 0;
  margin: auto !important;
  width: 50%;
  max-width: 300px;
}
</style>
