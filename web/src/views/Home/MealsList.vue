<template>
  <div class="meals-list">
    <div
      class="total-calories"
      :class="exceedGoal ? 'color-danger' : 'color-success'"
    >
      Eaten Calories: 400 / 3000
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

<script lang="js">
import Vue from 'vue';

import Pagination from '@/components/Pagination.vue';

export default Vue.extend({
  name: 'MealsList',

  components: {
    Pagination,
  },

  props: {
    mealsList: { type: Object, required: true },
  },

  data() {
    return {
      caloriesGoal: 3000,
    };
  },

  computed: {
    exceedGoal() {
      const calSum = Object.keys(this.mealsList)
        // eslint-disable-next-line no-return-assign, no-param-reassign
        .reduce((sum, k) => sum += this.mealsList[k].calories, 0);
      return this.caloriesGoal - calSum < 0;
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.meals-list {
  .total-calories {
    font-size: 1rem;
    padding: 10px;
    font-weight: 600;
    text-align: right;
    padding-right: 30px;
    margin: 5px (-$--card-padding) 20px;
  }
}
</style>
