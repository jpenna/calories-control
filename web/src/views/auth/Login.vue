<template>
  <div>
    <Header />

    <el-form
      ref="form"
      :model="form"
      label-position="top"
      @submit.native.prevent="handleLogin"
    >
     <el-form-item label="E-mail">
        <el-input placeholder="Email" v-model="form.email" name="email" autocomplete="true" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input placeholder="Password" v-model="form.password" name="password" show-password />
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
    };
  },

  methods: {
    ...mapActions('auth', ['doLogin']),

    handleLogin() {
      this.doLogin({
        email: this.form.email,
        password: this.form.password,
      });
    },
  },
});
</script>
