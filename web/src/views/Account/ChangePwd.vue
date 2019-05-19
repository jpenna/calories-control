<template>
  <!-- Modal -->
  <el-dialog
    :visible="show"
    :fullscreen="showFullScreen"
    class="password-modal"
    @close="$emit('update:show', false)"
    @closed="$refs.form.resetFields()"
  >
    <h2 slot="title" class="mb-0 mt-0">
      <img src="@/assets/emojis/monocle.png" class="mr-5" style="height: 2rem; vertical-align: sub" />
      Update password
    </h2>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="90px"
      hide-required-asterisk
      @submit.native.prevent
    >

      <el-form-item label="Current Password" prop="currentPassword">
        <el-input type="password" placeholder="Your current password" v-model="form.currentPassword" show-password />
      </el-form-item>

      <el-form-item label="New Password" prop="newPassword">
        <el-input type="password" placeholder="Your new password" v-model="form.newPassword" />
      </el-form-item>

      <el-form-item label="Confirm New Password" prop="confirmPassword">
        <el-input type="password" placeholder="Repeat the new password" v-model="form.confirmPassword" />
      </el-form-item>

      <div class="dialog-footer text-right mt-20">
        <el-button type="text" @click="$emit('update:show', false)" class="mr-30" :disabled="isChangingPassword">Cancel</el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmit" :loading="isChangingPassword">
          <img src="@/assets/emojis/thumbs_up.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
          Update!
        </el-button>
      </div>
    </el-form>

  </el-dialog>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'ChangePwd',

  props: {
    show: { type: Boolean, required: true },
  },

  data() {
    return {
      showFullScreen: utils.getWidth() <= 550,

      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },

      rules: {
        currentPassword: [{ required: true, trigger: 'submit', min: 6, message: 'Please insert your current password.' }],
        newPassword: [{ required: true, trigger: 'submit', min: 6, message: 'Please insert a new password.' }],
        confirmPassword: [{ required: true, trigger: 'submit', validator: this.validatePassword }],
      },
    };
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.showFullScreen = utils.getWidth() <= 550;
    });
  },

  computed: {
    ...mapState('users', ['isChangingPassword', 'passwordError']),
  },

  watch: {
    isChangingPassword(isChangingPassword) {
      if (isChangingPassword) return;
      if (!this.passwordError.status) {
        this.$emit('update:show', false);
        this.$notify({
          title: 'Password updated!',
          type: 'success',
        });
      }
    },
  },

  methods: {
    ...mapActions('users', ['changePassword']),

    validatePassword(rule, value, callback) {
      if (!value) {
        callback(new Error('Please input your password again.'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('The confirmation doesn\'t match!'));
      } else {
        callback();
      }
    },

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.changePassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        });
      });
    },
  },
});
</script>

<style lang="scss">
.password-modal {
  @media screen and (min-width: 550px) {
    .el-dialog {
      min-width: 500px;
    }
  }
}
</style>
