<template>
  <div>
    <el-card v-for="meal in mealsList" :key="meal.id">
      <div>{{ meal.name }}</div>
      <div>{{ meal.eatenAt }}</div>
      <div>{{ meal.calories }}</div>
      <div>{{ meal.userId }}</div>
      <div>{{ meal.notes }}</div>
    </el-card>

    <!-- Pagination -->
    <Pagination
      settingsKey="meals-list"
      :startPage="0"
      :total="50"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Pagination from '@/components/Pagination.vue';

export default Vue.extend({
  name: 'MealsList',

  components: {
    Pagination,
  },

  props: {
    mealsList: { type: Array, required: true },
  },
});
</script>
