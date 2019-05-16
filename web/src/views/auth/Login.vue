<template>
  <div>
    <Header />

    <el-form ref="form" :model="form" label-position="top" @submit="handleLogin">
      <el-form-item label="E-mail">
        <el-input placeholder="Email" v-model="form.email" name="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input placeholder="Password" v-model="form.password" name="password" show-password />
      </el-form-item>
    </el-form>

    <el-button @click="handleLogin">
      Login
    </el-button>

    <router-link :to="{ name: 'register' }" class="d-block">
      I don't have an account
    </router-link>
  </div>
</template>

<script lang="ts">
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
    ...mapActions('account', ['doLogin']),

    handleLogin() {
      this.doLogin({ email: this.form.email, password: this.form.password });
      // this.$router.push({ name: 'home' });
    },
  },
});
</script>
