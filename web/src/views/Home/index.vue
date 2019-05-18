<template>
  <div>
    <MealModal />
    <MealsFilter :date.sync="selectedDate" :timeRange.sync="timeRange" />

    <span v-show="isFetching.has(this.selectedDate)">
      <i class="el-icon-loading" />
      Loading...
    </span>

    <MealsList :mealsList="mealsList" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters, mapActions, mapState } from 'vuex';

import * as utils from '@/helpers/utils';

import MealsFilter from './MealsFilter.vue';
import MealsList from './MealsList.vue';
import MealModal from './MealModal.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    MealsFilter,
    MealsList,
    MealModal,
  },

  data() {
    const selectedDate = new Date();
    return {
      selectedDate,
      timeRange: [
        utils.setFirstTime(selectedDate),
        utils.setLastTime(selectedDate),
      ],
    };
  },

  computed: {
    ...mapGetters('meals', ['getMealsForDate']),
    ...mapState('meals', ['isFetching']),

    mealsList() {
      return this.getMealsForDate(this.selectedDate);
    },

    dateString() {
      return utils.getDateString(this.selectedDate);
    },
  },

  watch: {
    dateString(date) {
      this.fetchMeals({
        filters: {
          date,
        },
      });
    },
  },

  methods: {
    ...mapActions('meals', ['fetchMeals']),
  },
});
</script>
