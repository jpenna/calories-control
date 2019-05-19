<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="left"
    label-width="120px"
    hide-required-asterisk
    @submit.native.prevent
  >
    <el-form-item label="Name" prop="name">
      <el-input placeholder="name" v-model="form.name" />
    </el-form-item>

    <el-form-item label="E-mail" prop="email">
      <el-input placeholder="example@mail.com" v-model="form.email" />
    </el-form-item>

    <el-form-item label="Max Calories">
      <el-input-number
        :controls="false"
        :min="0"
        v-model="form.calories"
        name="calories"
      />
    </el-form-item>

    <div class="flex-split" :class="{ 'mt-40': !isMe }">
      <el-button v-if="isMe" @click="showUpdatePassword = true">
        <img src="@/assets/emojis/key.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
        Change Password
      </el-button>

      <el-button v-else @click="$emit('close')">
        Cancel
      </el-button>

      <div class="buttons-side">
        <el-button type="text" @click="resetFields" class="mr-30" :disabled="updatingUsers[myself.id]">Reset</el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmitUpdate" :loading="updatingUsers[myself.id]">
          <img src="@/assets/emojis/thumbs_up.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
          Submit
        </el-button>
      </div>
    </div>

    <ChangePwdModal :show.sync="showUpdatePassword" />

  </el-form>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';

import ChangePwd from './ChangePwd.vue';

export default Vue.extend({
  name: 'EditUser',

  components: {
    ChangePwdModal: ChangePwd,
  },

  props: {
    member: { type: Object, required: true },
  },

  data() {
    return {
      showUpdatePassword: false,

      form: {
        name: '',
        email: '',
        calories: 0,
      },

      rules: {
        email: [{ required: true, type: 'email', trigger: 'submit', message: 'Please insert a valid e-mail.' }],
        name: [{ required: true, type: 'string', trigger: 'submit', min: 3, message: 'Name should have at least 3 characters.' }],
        calories: [{ required: true, type: 'number', trigger: 'submit', min: 0, message: 'Input a valid amount.' }],
      },
    };
  },

  computed: {
    ...mapGetters('users', ['myself']),
    ...mapState('users', ['updatingUsers']),

    isMe() {
      return this.member.id === this.myself.id;
    },
  },

  watch: {
    member() {
      this.resetFields();
    },
  },

  mounted() {
    this.resetFields();
  },

  methods: {
    ...mapActions('users', ['updateUser']),

    handleSubmitUpdate() {
      this.updateUser({
        userId: this.member.id,
        dailyCalories: this.form.calories,
        name: this.form.name,
        email: this.form.email,
      });
    },

    resetFields() {
      this.$refs.form.resetFields();
      this.form.calories = this.member.dailyCalories;
      this.form.name = this.member.name;
      this.form.email = this.member.email;
    },
  },
});
</script>

<style lang="scss">
@media screen and (max-width: 430px) {
  .buttons-side {
    width: 100%;
    text-align: center;
    margin-top: 15px;
  }
}
</style>
