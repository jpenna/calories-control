<template>
  <div>
    <NewMeal />
    <MealsFilter />
    <MealsList :mealsList="mealsList" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import MealsFilter from './MealsFilter.vue';
import MealsList from './MealsList.vue';
import NewMeal from './NewMeal.vue';

export default Vue.extend({
  name: 'Home',

  components: {
    MealsFilter,
    MealsList,
    NewMeal,
  },

  data() {
    return {
      mealsList: [{
        userId: '5cd7e59e71b4dc90cded7f07',
        name: 'rice',
        notes: 'this wasn\'t good...',
        calories: 500,
        eatenAt: '2019-05-01T06:25:21.920Z',
        id: '5cd83bc8dd2c79a61448a41f',
      }],
    };
  },
});
</script>
