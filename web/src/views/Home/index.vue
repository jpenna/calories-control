<template>
  <div>
    <ActionBar
      :date.sync="selectedDate"
      :timeRange.sync="timeRange"
      :showMealModal.sync="showMealModal"
    />

    <span v-show="isFetching.has(this.selectedDate)">
      <i class="el-icon-loading" />
      Loading...
    </span>

    <MealsList :mealsList="mealsList" />

    <MealModal :show.sync="showMealModal" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions, mapState } from 'vuex';

import * as utils from '@/helpers/utils';

import ActionBar from './ActionBar.vue';
import MealsList from './MealsList.vue';
import MealModal from './MealModal.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    ActionBar,
    MealsList,
    MealModal,
  },

  mounted() {
    this.fetchMeals({ filters: { date: this.selectedDate } });
  },

  data() {
    const selectedDate = new Date();
    return {
      selectedDate,
      timeRange: [
        utils.setFirstTime(selectedDate),
        utils.setLastTime(selectedDate),
      ],

      showMealModal: false,
    };
  },

  computed: {
    ...mapGetters('meals', ['getMealsForDate']),
    ...mapState('meals', ['isFetching']),

    mealsList() {
      const mealsDay = this.getMealsForDate(this.selectedDate);

      return Object.keys(mealsDay)
        .reduce((acc, id) => {
          const meal = mealsDay[id];
          if (!utils.timeBetween(meal.eatenAt, this.timeRange[0], this.timeRange[1])) return acc;
          acc[id] = meal;
          return acc;
        }, {});
    },

    dayString() {
      return utils.getDayString(this.selectedDate);
    },
  },

  watch: {
    dayString(date) {
      this.fetchMeals({ filters: { date } });
    },
  },

  methods: {
    ...mapActions('meals', ['fetchMeals']),
  },
});
</script>
