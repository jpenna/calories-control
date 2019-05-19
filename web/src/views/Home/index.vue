<template>
  <div>
    <ActionBar
      :date.sync="selectedDate"
      :timeRange.sync="timeRange"
      :showMealModal.sync="showMealModal"
      :useTimeFilter.sync="useTimeFilter"
      :userId.sync="selectedUserId"
    />

    <MealsList
      :mealsList="mealsList"
      :isFetchingList="isFetchingDate"
      :caloriesTotal="caloriesTotal"
      :showCalories="!!selectedUserId"
      @editMeal="editMeal"
    />

    <Pagination
      v-show="filteredList.length"
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
      selectedUserId: '',

      firstItem: 0,
      maxSize: 0,
      mealsLength: 0,

      showMealModal: false,
      selectedMeal: {},
    };
  },

  computed: {
    ...mapGetters('meals', ['getMealsForDate', 'getTotalMealsForDate']),
    ...mapState('meals', ['isFetching']),

    filteredList() {
      console.log('get filtered');
      const mealsDay = this.getMealsForDate(this.selectedDate);

      return Object.keys(mealsDay)
        // Filter
        .reduce((acc, id) => {
          const meal = mealsDay[id];
          if (this.useTimeFilter && !utils.timeBetween(meal.eatenAt, this.timeRange[0], this.timeRange[1])) return acc;
          if (this.selectedUserId && meal.userId !== this.selectedUserId) return acc;
          acc.push(meal);
          return acc;
        }, [])
        // Sort (now to keep the list ordered for pagination and grouping)
        .sort(({ eatenAt: a }, { eatenAt: b }) => {
          const aTime = a.getTime();
          const bTime = b.getTime();
          if (aTime === bTime) return 0;
          return aTime < bTime ? -1 : 1;
        });
    },

    mealsList() {
      const grouped = this.filteredList
        // Group
        .reduce((acc, meal, index) => {
          if (!acc[meal.userId]) acc[meal.userId] = [];
          acc[meal.userId].push(meal);
          return acc;
        }, {});

      let count = 0;
      return Object.keys(grouped).reduce((acc, userId) => {
        // Maximum count
        console.log('---------------')
        console.log(1, count)
        if (count >= this.firstItem + this.maxSize) return acc;
        // Skip some of group if pass
        const toSkip = this.firstItem - count;
        count += grouped[userId].length;
        // Skip until page start
        console.log(2, toSkip)
        console.log(3, count)
        console.log(4, this.firstItem)
        if (count <= this.firstItem) return acc;

        let useGroup = grouped[userId];

        const excess = (this.firstItem + this.maxSize) - count;
        console.log(5, excess)
        if (excess < 0) useGroup = useGroup.slice(0, excess);

        if (toSkip > 0) useGroup = useGroup.slice(toSkip);

        console.log(6, useGroup)
        acc[userId] = useGroup;
        return acc;
      }, {});
    },

    dayString() {
      return utils.getDayString(this.selectedDate);
    },

    totalForDay() {
      return this.getTotalMealsForDate(this.selectedDate);
    },

    caloriesTotal() {
      const mealsDay = this.getMealsForDate(this.selectedDate);
      return Object.keys(mealsDay).reduce((acc, id) => acc + mealsDay[id].calories, 0);
    },

    isFetchingDate() {
      const fetching = this.isFetching[this.dayString];
      if (fetching === undefined) return true;
      return fetching;
    },
  },

  watch: {
    dayString() {
      this.doFetchMeals();
    },

    selectedDate(selectedDate) {
      const adjusted = utils.adjustTimezone(selectedDate);
      const [year, month, date] = adjusted.toISOString().split('T')[0].split('-');
      this.timeRange[0].setFullYear(year, month - 1, date);
      this.timeRange[1].setFullYear(year, month - 1, date);
    },
  },

  created() {
    this.doFetchMeals({
      filters: { date: this.dayString },
    });
  },

  methods: {
    ...mapActions('meals', ['fetchMeals']),

    doFetchMeals() {
      this.fetchMeals({
        filters: { date: this.dayString },
      });
    },

    updatePagination({ firstItem, size }) {
      this.firstItem = firstItem;
      this.maxSize = size;
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
