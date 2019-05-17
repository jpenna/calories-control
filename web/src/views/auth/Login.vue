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
      <el-button native-type="submit" type="primary" class="w-100 mb-40 mt-30">
        Login
      </el-button>
    </el-form>

    <router-link :to="{ name: 'register' }" class="d-block text-center">
      <el-link type="info" :underline="false">I don't have an account</el-link>
    </router-link>
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import Header from '@/components/Header.vue';
import { mapActions } from 'vuex';

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
        password: [{ required: true, trigger: 'blur', message: 'Please insert a password' }],
      },
    };
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
