<template>
  <div>
    <div>
      Total Caories: 400 / 3000
    </div>

    <el-card v-for="meal in mealsList" :key="meal.id">
      <el-button>Edit</el-button>
      <el-button>Remove</el-button>
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
