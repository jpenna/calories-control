<template>
  <div>
    <Header />

    <el-form ref="form" :model="form" label-position="top">
      <el-form-item label="Name">
        <el-input placeholder="name" v-model="form.name" name="email" />
      </el-form-item>

      <el-form-item label="E-mail">
        <el-input placeholder="example@mail.com" v-model="form.email" name="email" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input type="password" placeholder="Your password" v-model="form.password" name="password" />
      </el-form-item>

      <el-form-item label="Password Confirmation">
        <el-input type="password" placeholder="Repeat your password" v-model="form.confirmPassword" name="password" />
      </el-form-item>

    </el-form>

    <el-button @click="handleRegister">
      Register
    </el-button>

    <router-link :to="{ name: 'login' }" class="d-block">
      I already have an account
    </router-link>
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import Header from '@/components/Header.vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'Register',

  components: {
    Header,
  },

  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },

  methods: {
    ...mapActions('auth', ['doRegister']),

    handleRegister() {
      this.doRegister({
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
      });
    },
  },
});
</script>
