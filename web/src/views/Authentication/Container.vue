<template>
  <el-card class="box-card container">
    <router-view />
  </el-card>
</template>

<script lang="js">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'UnauthorizedContainer',

  beforeRouteUpdate(to, from, next) {
    this.clearAuthError();
    next();
  },

  methods: {
    ...mapMutations('auth', ['clearAuthError']),
  },

  computed: {
    ...mapState('auth', ['isAuthenticated']),
  },

  mounted() {
    if (this.isAuthenticated) this.$router.push({ name: 'home' });
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-width: 400px;
  max-width: 400px;
  width: 50%;
  margin: auto;

  margin-top: 10vh;
}
</style>
