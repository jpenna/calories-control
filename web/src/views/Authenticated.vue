<template>
  <el-container>
    <el-header height="80px">
      <Header />
    </el-header>

    <el-main>
      <router-view />
    </el-main>

  </el-container>
</template>

<script lang="ts">
import Vue from 'vue';

import Header from '@/components/Header.vue';

export default Vue.extend({
  name: 'Authenticated',

  components: {
    Header,
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.el-container {
  background: white;
  max-width: 900px;
  margin: auto;
  box-shadow: 0 0 5px transparentize(black, 0.8);
  min-height: 100vh;
}

.el-header {
  background: darken($background-color, 10);
}
</style>
