<template>
  <div :class="isAuth ? 'flex-split' : 'text-center mb-30'" style="height: 100%">
    <router-link to="/">
      <img src="@/assets/logo.png" :width="isAuth ? '140px' : '200px'" />
    </router-link>

    <router-link :to="{ name: 'account' }" v-if="isAuth" class="settings-link icon-format">
      <img src="@/assets/emojis/wrench.png" style="height: 1.5rem" />
      <span class="fw-500 ml-5 color-regular">Settings</span>
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

<style lang="scss">
.settings-link {
  @media screen and (min-width: 450px) {
    margin-right: 30px;
  }
}
</style>
