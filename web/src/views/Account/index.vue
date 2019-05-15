<template>
  <div>
    <a @click="$router.go(-1)">
      <i class="el-icon-caret-left" />
      Back
    </a>

    <h1>Account</h1>

    <!-- Calories goal -->
    <el-form ref="form" :model="form" label-position="top" @submit="submitCalories">
      <el-form-item label="Calories Goal">
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

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

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

  methods: {
    submitCalories() {
      console.log('submit');
    },
  },
});
</script>
