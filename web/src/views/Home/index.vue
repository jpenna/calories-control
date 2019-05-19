<template>
  <div>
    <ActionBar
      :date.sync="selectedDate"
      :timeRange.sync="timeRange"
      :showMealModal.sync="showMealModal"
      :useTimeFilter.sync="useTimeFilter"
    />

    <span v-show="isFetching.has(this.selectedDate)">
      <i class="el-icon-loading" />
      Loading...
    </span>

    <MealsList
      :mealsList="mealsList"
      @editMeal="editMeal"
    />

    <Pagination
      v-show="mealsList.length"
      class="mt-30"
      settingsKey="meals-list"
      :startPage="0"
      :total="totalForDay"
      @change="updatePagination"
    />

    <MealModal
      :show.sync="showMealModal"
      :selectedMeal="selectedMeal"
      @close="clearSelectedMeal"
    />
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

  data() {
    const selectedDate = new Date();
    return {
      selectedDate,
      useTimeFilter: false,
      timeRange: [
        utils.setFirstTime(selectedDate),
        utils.setLastTime(selectedDate),
      ],

      firstItem: 0,
      maxSize: 0,

      showMealModal: false,
      selectedMeal: {},
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
          if (this.useTimeFilter && !utils.timeBetween(meal.eatenAt, this.timeRange[0], this.timeRange[1])) return acc;
          acc.push(meal);
          return acc;
        }, [])
        .slice(this.firstItem, this.firstItem + this.maxSize);
    },

    dayString() {
      return utils.getDayString(this.selectedDate);
    },

    totalForDay() {
      return this.getTotalMealsForDate(this.selectedDate);
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

    timeRange(timeRange) {
      const mealsDay = this.getMealsForDate(this.selectedDate);

      if (Object.keys(mealsDay).length < this.totalForDay) {
        this.fetchMealsPag(true, this.timeRange);
      }
    },
  },

  methods: {
    ...mapActions('meals', ['fetchMeals']),

    fetchMealsPag(force, timeRange) {
      this.fetchMeals({
        filters: {
          date: this.dayString,
          limit: this.maxSize,
          skip: this.firstItem,
          timeRange,
        },
        force,
      });
    },

    updatePagination({ firstItem, size }) {
      this.firstItem = firstItem;
      this.maxSize = size;
      this.fetchMealsPag(true);
    },

    editMeal(mealId) {
      this.showMealModal = true;
      this.selectedMeal = this.getMealsForDate(this.selectedDate)[mealId];
    },

    clearSelectedMeal() {
      this.selectedMeal = {};
    },
  },
});
</script>
