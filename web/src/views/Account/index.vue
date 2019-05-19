<template>
  <div class="pb-50" style="position: relative">

    <!-- Back link -->
    <div>
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
      :rules="rules"
      label-position="left"
      label-width="120px"
      hide-required-asterisk
      @submit.native.prevent
    >
      <el-form-item label="Name" prop="name">
        <el-input placeholder="name" v-model="form.name" />
      </el-form-item>

      <el-form-item label="E-mail" prop="email">
        <el-input placeholder="example@mail.com" v-model="form.email" />
      </el-form-item>

      <el-form-item label="Max Calories">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="form.calories"
          name="calories"
        />
      </el-form-item>

      <div class="flex-split">
        <el-button @click="showUpdatePassword = true">
          <img src="@/assets/emojis/key.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
          Change Password
        </el-button>

        <div class="buttons-side">
          <el-button type="text" @click="resetFields" class="mr-30" :disabled="isUpdatingUser">Cancel</el-button>
          <el-button type="primary" native-type="submit" @click="handleSubmitUpdate" :loading="isUpdatingUser">
            <img src="@/assets/emojis/thumbs_up.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
            Submit
          </el-button>
        </div>
      </div>
    </el-form>

    <!-- Users permissions -->
    <UsersList v-if="$hasRole('usersEdit', myself)" style="margin: auto" class="mt-50 mb-100"/>

    <el-button type="danger" class="logout-button" @click="handleLogout">
      Logout
    </el-button>

    <ChangePwdModal :show.sync="showUpdatePassword" />

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';

import UsersList from './UsersList.vue';
import ChangePwd from './ChangePwd.vue';

export default Vue.extend({
  name: 'Account',

  components: {
    UsersList,
    ChangePwdModal: ChangePwd,
  },

  data() {
    return {
      showUpdatePassword: false,

      form: {
        name: '',
        email: '',
        calories: 0,
      },

      rules: {
        email: [{ required: true, type: 'email', trigger: 'submit', message: 'Please insert a valid e-mail.' }],
        name: [{ required: true, type: 'string', trigger: 'submit', min: 3, message: 'Name should have at least 3 characters.' }],
        calories: [{ required: true, type: 'number', trigger: 'submit', min: 0, message: 'Input a valid amount.' }],
      },
    };
  },

  computed: {
    ...mapGetters('users', ['myself']),
    ...mapState('users', ['isUpdatingUser']),
  },

  watch: {
    myself(myself) {
      this.resetFields();
    },
  },

  mounted() {
    this.resetFields();
  },

  methods: {
    ...mapMutations('auth', ['doLogout']),
    ...mapActions('users', ['updateUser']),

    handleSubmitUpdate() {
      this.updateUser({
        userId: this.myself.id,
        dailyCalories: this.form.calories,
        name: this.form.name,
        email: this.form.email,
      });
    },

    handleLogout() {
      this.doLogout();
    },

    resetFields() {
      this.$refs.form.resetFields();
      this.form.calories = this.myself.dailyCalories;
      this.form.name = this.myself.name;
      this.form.email = this.myself.email;
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

@media screen and (max-width: 430px) {
  .buttons-side {
    width: 100%;
    text-align: center;
    margin-top: 15px;
  }
}
</style>
