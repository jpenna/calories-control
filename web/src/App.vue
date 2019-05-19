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

  created() {
    window.$notifyGlobal = (params) => {
      const message = typeof params === 'string' ? params : params.message;
      const { title, type } = params as any;

      this.$notify({ title, message, type });
    };

    window.$messageGlobal = (message, type = 'success') => {
      this.$message({ message, type });
    };
  },
});
</script>
