<template>
  <div>
    <Header />

    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="Name" prop="name">
        <el-input placeholder="name" v-model="form.name" />
      </el-form-item>

      <el-form-item label="E-mail" prop="email">
        <el-input placeholder="example@mail.com" v-model="form.email" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input type="password" placeholder="Your password" v-model="form.password" />
      </el-form-item>

      <el-form-item label="Password Confirmation" prop="confirmPassword">
        <el-input type="password" placeholder="Repeat your password" v-model="form.confirmPassword" />
      </el-form-item>

      <el-form-item prop="acceptTos">
        <el-checkbox v-model="form.acceptTos">
          <span style="vertical-align: bottom">I accept the </span>
          <el-link type="info" @click="showTos = true" :underline="false">Terms & Condtions</el-link>
        </el-checkbox>
      </el-form-item>

    </el-form>

    <el-button :loading="isAuthenticating" @click="handleRegister" type="primary" class="d-block w-100 mb-40 mt-5">
      Register
    </el-button>

    <div
      class="error-message text-center mb-20"
      style="margin-top: -20px"
      v-show="authError.status"
    >
      <span v-if="authError.status === -1">Check your network connection.</span>
      <span v-else-if="authError.code === 1">E-mail is already used.</span>
      <span v-else-if="authError.code === 2">Validation error, please get in touch if the error persists.</span>
      <span v-else-if="authError.code === 3">Server error, please try again later.</span>
      <span v-else>Unknown error, please get in touch if the error persists.</span>
    </div>

    <router-link :to="{ name: 'login' }" class="d-block text-center">
      <el-link type="info" :underline="false">I already have an account</el-link>
    </router-link>

    <ToS :show.sync="showTos" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

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

      rules: {
        email: [{ required: true, type: 'email', trigger: 'change', message: 'Please insert a valid e-mail.' }],
        name: [{ required: true, type: 'string', min: 3, message: 'Name should have at least 3 characters.' }],
        password: [{ required: true, trigger: 'change', min: 6, message: 'Please insert a password.' }],
        confirmPassword: [{ required: true, trigger: 'change', validator: this.validatePassword }],
        acceptTos: [{
          required: true,
          trigger: 'change',
          type: 'enum',
          enum: ['true'],
          transform: v => v.toString(),
          message: 'You must accept before continuing.',
        }],
      },
    };
  },

  computed: {
    ...mapState('auth', ['authError']),
  },

  methods: {
    ...mapActions('auth', ['doRegister']),

    validatePassword(rule, value, callback) {
      if (!value) {
        callback(new Error('Please input your password again.'));
      } else if (value !== this.form.password) {
        callback(new Error('The confirmation doesn\'t match!'));
      } else {
        callback();
      }
    },

    handleRegister() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.doRegister({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          acceptTos: this.form.acceptTos,
        });
      });
    },
  },
});
</script>
