<template>
  <div :class="isAuth ? 'flex-split' : 'text-center mb-30'" style="height: 100%">
    <router-link to="/">
      <img src="@/assets/logo.png" :width="isAuth ? '140px' : '200px'" />
    </router-link>

    <router-link :to="{ name: 'account' }" v-if="isAuth" class="mr-30 icon-format">
      <img src="@/assets/emojis/smile.png" style="height: 1.5rem" />
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
