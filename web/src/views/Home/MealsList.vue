<template>
  <div class="meals-list">
    <div
      class="total-calories"
      :class="exceedGoal ? 'color-danger' : 'color-success'"
    >
      Eaten Calories: 400 / 3000
    </div>

    <el-card v-for="meal in mealsList" :key="meal.id" class="meal-card">
      <div class="flex-split" style="align-items: flex-start">
        <div>
          <!-- Name -->
          <div class="fs-120 fw-600 mt-10">{{ meal.name }}</div>

          <!-- User -->
          <div class="icon-format mt-10">
            <img src="@/assets/emojis/smile.png" style="height: 1.2rem" class="v-align-middle" />
            <span>{{ meal.userId }}</span>
          </div>

          <div class="fw-500 mt-10">
            <!-- Calories -->
            <span class="icon-format">
              <img src="@/assets/emojis/fire.png" style="height: 1.2rem" class="v-align-middle" />
              <span>{{ meal.calories }} cal</span>
            </span>
            <!-- Time -->
            <span class="ml-30 icon-format">
              <img src="@/assets/emojis/clock.png" style="height: 1.2rem" class="v-align-middle" />
              <span>{{ meal.eatenAt | filterTime }}</span>
            </span>
          </div>
          <!-- Notes -->
          <div v-if="meal.notes" class="mt-10" style="font-style: italic">
            {{ meal.notes }}
          </div>
        </div>

        <div>
          <el-button type="text">
            <img src="@/assets/emojis/pencil.png" style="height: 1.2rem" />
          </el-button>

          <el-button type="text" class="ml-25">
            <img src="@/assets/emojis/times.png" style="height: 1.2rem" />
          </el-button>
        </div>
      </div>


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

  filters: {
    filterTime(date) {
      return `${date.getHours()}:${date.getMinutes()}`;
    },
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

  .meal-card {
    .el-card__body {
      padding-top: 10px;
    }

    &:not(:last-of-type) {
      margin-bottom: 30px;
    }
  }
}
</style>
