<template>
  <div>
    <div class="offline-warning" v-show="!online">
      <div class="fw-600">You are navigating offline.</div>
      You can continue to use the application, but the data might be outdate.
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { mapState } from 'vuex';
import { Users } from './store/modules/@types';

export default Vue.extend({
  data() {
    return {
      online: navigator.onLine,
    };
  },

  computed: {
    ...mapState('auth', ['isAuthenticated']),
  },

  watch: {
    isAuthenticated() {
      this.$router.push('/');
    },
  },

  created() {
    Vue.prototype.$hasRole = (role: string, user: Users.UserInterface) => (user.permissions || []).includes(role);

    window.$notifyGlobal = (params) => {
      const message = typeof params === 'string' ? params : (params.message || '');
      const { title, type } = params as any;

      this.$notify({ title, message, type });
    };

    window.$messageGlobal = (message, type = 'success') => {
      this.$message({ message, type });
    };

    window.addEventListener('online', () => { this.online = true; });
    window.addEventListener('offline', () => { this.online = false; });
  },
});
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.offline-warning {
  width: 100%;
  text-align: center;
  padding: 7px 0;
  background: transparentize($--color-danger, 0.4);
  border: solid 1px $--color-danger;
}
</style>
