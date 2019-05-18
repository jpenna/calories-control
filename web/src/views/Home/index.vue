<template>
  <div>
    <MealModal />
    <MealsFilter :date.sync="selectedDate" :timeRange.sync="timeRange" />
    <MealsList :mealsList="mealsList" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters } from 'vuex';

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

    mealsList() {
      // return this.getMealsForDate()
      return [];
    },
  },
});
</script>
