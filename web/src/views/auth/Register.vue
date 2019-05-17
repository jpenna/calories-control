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

      <el-form-item>
        <el-checkbox v-model="form.tos">
          <span style="vertical-align: bottom">I accept the </span>
          <el-link type="info" @click="showTos = true" :underline="false">Terms & Condtions</el-link>
        </el-checkbox>
      </el-form-item>

    </el-form>

    <el-button @click="handleRegister" type="primary" class="d-block w-100 mb-40 mt-5">
      Register
    </el-button>

    <router-link :to="{ name: 'login' }" class="d-block text-center">
      <el-link type="info" :underline="false">I already have an account</el-link>
    </router-link>

    <ToS :show.sync="showTos" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions } from 'vuex';

import Header from '@/components/Header.vue';
import ToS from './tos.vue';

export default Vue.extend({
  name: 'Register',

  components: {
    Header,
    ToS,
  },

  data() {
    return {
      showTos: false,
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTos: false,
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
        tos: this.form.tos,
      });
    },
  },
});
</script>
