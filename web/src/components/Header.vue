<template>
  <div class="flex-split">
    <router-link to="/">
      <h1>CalControl</h1>
    </router-link>

    <router-link :to="{ name: 'account' }" v-if="isAuth">
      <img src="@/assets/emojis/moyai.png" style="height: 2rem" />
      <span class="fw-500 ml-5 color-regular">Account</span>
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
