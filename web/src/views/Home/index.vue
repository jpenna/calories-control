<template>
  <div>
    <FilterMeals />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import FilterMeals from './FilterMeals.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    FilterMeals,
  },
});
</script>
