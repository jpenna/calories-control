<template>
  <div>
    <el-form ref="form" :model="form" label-position="top">
      <el-form-item label="Name">
        <el-input placeholder="name" v-model="form.name" name="email" />
      </el-form-item>

      <el-form-item label="E-mail">
        <el-input placeholder="example@mail.com" v-model="form.email" name="email" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input placeholder="Your password" v-model="form.password" name="password" />
      </el-form-item>

      <el-form-item label="Password Confirmation">
        <el-input placeholder="Repeat your password" v-model="form.confirmPassword" name="password" />
      </el-form-item>
    </el-form>

    <el-button>
      Register
    </el-button>

    <router-link :to="{ name: 'login' }" class="d-block">
      I already have an account
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Register',

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
});
</script>
