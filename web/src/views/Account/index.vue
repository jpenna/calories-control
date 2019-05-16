<template>
  <div>
    <a @click="$router.go(-1)">
      <i class="el-icon-caret-left" />
      Back
    </a>

    <h1>Account</h1>

    <!-- Max Calories -->
    <el-form ref="form" :model="form" label-position="top" @submit="submitCalories">
      <el-form-item label="Max Calories">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="form.calories"
          name="calories"
        />
        <i class="el-icon-success" />
      </el-form-item>
    </el-form>

    <!-- Users permissions -->
    <UsersRoles />

    <el-button @click="handleLogout">
      Logout
    </el-button>

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations } from 'vuex';

import UsersRoles from './UsersRoles.vue';

export default Vue.extend({
  name: 'Account',

  components: {
    UsersRoles,
  },

  data() {
    return {
      form: {
        calories: 0,
      },
    };
  },

  computed: {
    ...mapMutations('auth', ['doLogout']),
  },

  methods: {

    submitCalories() {
      console.log('submit');
    },

    handleLogout() {
      this.doLogout();
    },
  },
});
</script>
