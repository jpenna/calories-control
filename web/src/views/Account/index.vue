<template>
  <div class="text-center">

    <!-- Back link -->
    <div class="text-left">
      <el-link type="info" class="fs-100" :underline="false" @click="$router.go(-1)">
        <i class="el-icon-caret-left" />
        Back
      </el-link>
    </div>

    <h1 class="mb-50">Account</h1>

    <!-- Max Calories -->
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="100px"
      @submit.native.prevent="submitCalories"
    >
      <el-form-item label="Max Calories" class="d-inline-block">
        <el-input-number
          v-loading="isUpdatingCalories"
          :controls="false"
          :min="0"
          v-model="form.calories"
          name="calories"
          @input="debounceSubmit"
        />
      </el-form-item>
    </el-form>

    <!-- Users permissions -->
    <UsersRoles v-if="$hasRole('usersEdit', myself)" style="max-width: 650px; margin: auto" class="mb-100"/>

    <el-button type="danger" class="logout-button" @click="handleLogout">
      Logout
    </el-button>

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';

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
    ...mapGetters('users', ['myself']),
    ...mapState('users', ['isUpdatingCalories']),
  },

  watch: {
    myself(myself) {
      this.form.calories = myself.dailyCalories;
    },
  },

  mounted() {
    this.form.calories = this.myself.dailyCalories;
  },

  methods: {
    ...mapMutations('auth', ['doLogout']),
    ...mapActions('users', ['updateCalories']),

    debounceSubmit() {
      console.log('submit on change');
    },

    submitCalories() {
      this.updateCalories({ userId: this.myself.id, calories: this.form.calories });
    },

    handleLogout() {
      this.doLogout();
    },
  },
});
</script>

<style lang="scss">
.logout-button {
  position: absolute;
  bottom: 40px;
  right: 0;
  left: 0;
  margin: auto !important;
  width: 50%;
  max-width: 300px;
}
</style>
