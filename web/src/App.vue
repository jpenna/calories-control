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
    ...mapState('account', ['isAuthenticated']),
  },

  watch: {
    isAuthenticated: {
      immediate: true,
      handler(isAuthenticated: boolean): void {
        if (!isAuthenticated) this.$router.push({ name: 'login' });
        else if (this.$route.matched[0].name !== 'auth') this.$router.push({ name: 'home' });
      },
    },
  },
});
</script>
