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
    isAuthenticated() {
      this.$router.push('/');
    },
  },
});
</script>
