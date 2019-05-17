<template>
  <div class="flex-split">
    <h1>CNAme</h1>

    <router-link :to="{ name: 'account' }" v-if="isAuth">
      <i class="el-icon-user" />
      Account
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Header',

  data() {
    return {
      // default is not included in the props type...
      isAuth: ((this.$route.matched[0].props as any).default || {}).auth,
    };
  },
});
</script>
