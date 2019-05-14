<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" label-position="top">
      <el-form-item label="E-mail">
        <el-input placeholder="Email" v-model="form.email" name="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input placeholder="Password" v-model="form.password" name="password" show-password />
      </el-form-item>

      <router-link :to="{ name: 'forgot' }">
        Forgot Password
      </router-link>
    </el-form>

    <el-button>
      Login
    </el-button>

    <router-link :to="{ name: 'register' }" class="d-block">
      I don't have an account
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
});
</script>
