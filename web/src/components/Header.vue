<template>
  <div>
    Header

    <router-link :to="{ name: 'account' }">
      Account
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Header',
});
</script>
