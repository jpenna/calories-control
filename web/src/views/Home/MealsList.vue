<template>
  <div>
    <el-card v-for="meal in mealsList" :key="meal.id">
      <div>{{ meal.name }}</div>
      <div>{{ meal.eatenAt }}</div>
      <div>{{ meal.calories }}</div>
      <div>{{ meal.userId }}</div>
      <div>{{ meal.notes }}</div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MealsList',

  props: {
    mealsList: { type: Array, required: true },
  },
});
</script>
