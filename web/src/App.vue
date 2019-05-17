<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapState('auth', ['isAuthenticated']),
  },

  watch: {
    isAuthenticated: {
      immediate: true,
      handler(isAuthenticated: boolean): void {
        if (this.$route.matched[0].path === '/home') { // Authenticated entry point
          if (!isAuthenticated) this.$router.push({ name: 'login' });
        } else if (isAuthenticated) this.$router.push({ name: 'home' });
      },
    },
  },
});
</script>
