<template>
  <div class="pb-50" style="position: relative">

    <!-- Back link -->
    <div>
      <el-link type="info" class="fs-100" :underline="false" @click="$router.go(-1)">
        <i class="el-icon-caret-left" />
        Back
      </el-link>
    </div>

    <h1 class="mb-50">Account</h1>

    <!-- User form -->
    <EditUser :member="myself" />

    <!-- Users permissions -->
    <UsersList v-if="$hasRole('usersEdit', myself)" style="margin: auto" class="mt-50 mb-100"/>

    <el-button type="danger" class="logout-button" @click="handleLogout">
      Logout
    </el-button>

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex';

import UsersList from './UsersList.vue';
import EditUser from './EditUser.vue';

export default Vue.extend({
  name: 'Account',

  components: {
    UsersList,
    EditUser,
  },

  data() {
    return {
      showUpdatePassword: false,
    };
  },

  computed: {
    ...mapGetters('users', ['myself']),
    ...mapState('users', ['updatingUsers']),
  },

  methods: {
    ...mapMutations('auth', ['doLogout']),

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

@media screen and (max-width: 430px) {
  .buttons-side {
    width: 100%;
    text-align: center;
    margin-top: 15px;
  }
}
</style>
