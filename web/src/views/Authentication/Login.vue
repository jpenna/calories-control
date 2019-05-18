<template>
  <div>
    <Header />

    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      hide-required-asterisk
      label-position="top"
      @submit.native.prevent="handleLogin"
    >
      <el-form-item label="E-mail" prop="email">
        <el-input placeholder="Email" v-model="form.email" autocomplete="true" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input placeholder="Password" v-model="form.password" show-password />
      </el-form-item>
      <el-button :loading="isAuthenticating" native-type="submit" type="primary" class="w-100 mb-40 mt-30">
        Login
      </el-button>
    </el-form>

    <div
      class="error-message text-center mb-20"
      style="margin-top: -20px"
      v-show="authError.status"
    >
      <span v-if="authError.status === -1">Check your network connection.</span>
      <span v-else-if="authError.status !== 500">E-mail or password is wrong.</span>
      <span v-else>Server error, please try again later.</span>
    </div>

    <router-link :to="{ name: 'register' }" class="d-block text-center">
      <el-link type="info" :underline="false">I don't have an account</el-link>
    </router-link>
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import Header from '@/components/Header.vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  components: {
    Header,
  },

  data() {
    return {
      form: {
        email: '',
        password: '',
      },

      rules: {
        email: [{ required: true, type: 'email', trigger: 'blur', message: 'Please insert a valid e-mail.' }],
        password: [{ required: true, trigger: 'blur', min: 6, message: 'Password should be longer than 6 characters.' }],
      },
    };
  },

  computed: {
    ...mapState('auth', ['authError', 'isAuthenticating']),
  },

  methods: {
    ...mapActions('auth', ['doLogin']),

    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.doLogin({
          email: this.form.email,
          password: this.form.password,
        });
      });
    },
  },
});
</script>
