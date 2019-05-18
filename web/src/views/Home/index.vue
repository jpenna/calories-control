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

    <MealsList
      :mealsList="mealsList"
    />

    <Pagination
      v-show="mealsList.length"
      class="mt-30"
      settingsKey="meals-list"
      :startPage="0"
      :total="getTotalMealsForDate(selectedDate)"
      @change="updatePagination"
    />

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
import Pagination from '@/components/Pagination.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    ActionBar,
    MealsList,
    MealModal,
    Pagination,
  },

  mounted() {
    this.fetchMealsPag();
  },

  data() {
    const selectedDate = new Date();
    return {
      selectedDate,
      timeRange: [
        utils.setFirstTime(selectedDate),
        utils.setLastTime(selectedDate),
      ],

      firstItem: 0,
      maxSize: 0,

      showMealModal: false,
    };
  },

  computed: {
    ...mapGetters('meals', ['getMealsForDate', 'getTotalMealsForDate']),
    ...mapState('meals', ['isFetching']),

    mealsList() {
      const mealsDay = this.getMealsForDate(this.selectedDate);

      return Object.keys(mealsDay)
        .reduce((acc, id) => {
          const meal = mealsDay[id];
          if (!utils.timeBetween(meal.eatenAt, this.timeRange[0], this.timeRange[1])) return acc;
          acc.push(meal);
          return acc;
        }, []);
    },

    dayString() {
      return utils.getDayString(this.selectedDate);
    },
  },

  watch: {
    dayString() {
      this.fetchMealsPag();
    },

    selectedDate(selectedDate) {
      const adjusted = utils.adjustTimezone(selectedDate);
      const [year, month, date] = adjusted.toISOString().split('T')[0].split('-');
      this.timeRange[0].setFullYear(year, month - 1, date);
      this.timeRange[1].setFullYear(year, month - 1, date);
    },
  },

  methods: {
    ...mapActions('meals', ['fetchMeals']),

    fetchMealsPag(force) {
      this.fetchMeals({
        filters: {
          date: this.dayString,
          limit: this.maxSize,
          skip: this.firstItem,
        },
        force,
      });
    },

    updatePagination({ firstItem, size }) {
      if (size >= this.getTotalMealsForDate(this.selectedDate)) return;
      this.firstItem = firstItem;
      this.maxSize = size;
      this.fetchMealsPag(true);
    },
  },
});
</script>
