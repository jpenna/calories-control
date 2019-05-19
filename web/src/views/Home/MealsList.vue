<template>
  <div class="meals-list">
    <!-- Calories -->
    <div
      v-show="hasMeals && selectedUserId"
      class="total-calories"
      :class="exceedGoal ? 'color-danger' : 'color-success'"
    >
      <img
        v-show="exceedGoal"
        src="@/assets/emojis/crying.png"
        style="height: 2rem; vertical-align: sub"
        class="mr-15"
      />
      Eaten Calories: {{ caloriesTotal }} / {{ selectedUser.dailyCalories }}
    </div>

    <div v-show="!hasMeals && !isFetchingList" class="text-center fw-500 mt-50 mb-100">
      <img src="@/assets/emojis/relieved.png" style="height: 4rem" />
      <div class="mt-5 fs-140">Looks like someone was fasting!</div>
      <div class="mt-5">No meals for the selected period.</div>
    </div>

    <div v-show="hasMeals">
      <!-- Grouped by User -->
      <div v-for="(userMeals, id) in mealsList" :key="id" class="separate-list">
        <h4 class="color-regular">{{ usersList[id].name }}</h4>

        <!-- List Meals -->
        <el-card v-for="meal in userMeals" :key="meal.id" class="meal-card separate-list">
          <div>
            <div class="flex-split" style="align-items: flex-start">
              <!-- Name -->
              <div class="fs-120 fw-600 mt-10">{{ meal.name }}</div>

              <!-- Actions -->
              <div>
                <el-tooltip effect="light" content="Edit" :open-delay="500">
                  <el-button type="text" @click="$emit('editMeal', meal.id)">
                    <img src="@/assets/emojis/pencil.png" style="height: 1.2rem" />
                  </el-button>
                </el-tooltip>

                <el-tooltip effect="light" content="Delete" :open-delay="500">
                  <el-button type="text" class="ml-25" @click="handleRemoveMeal(meal.id, meal.eatenAt)">
                    <img v-if="!removingIds.includes(meal.id)" src="@/assets/emojis/times.png" style="height: 1.2rem" />
                    <i v-else class="el-icon-loading" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>

            <!-- User -->
            <div v-if="$hasRole('mealsAll', myself)" class="icon-format">
              <img src="@/assets/emojis/smile.png" style="height: 1.2rem" class="v-align-middle" />
              <span>{{ usersList[meal.userId].name || meal.userId }}</span>
            </div>

            <div class="fw-500 mt-10">
              <!-- Time -->
              <span class="icon-format">
                <img src="@/assets/emojis/clock.png" style="height: 1.2rem" class="v-align-middle" />
                <span>{{ meal.eatenAt | filterTime }}</span>
              </span>
              <!-- Calories -->
              <span class="ml-30 icon-format">
                <img src="@/assets/emojis/fire.png" style="height: 1.2rem" class="v-align-middle" />
                <span>{{ meal.calories }} cal</span>
              </span>
            </div>

            <!-- Notes -->
            <div v-if="meal.notes" class="mt-10" style="font-style: italic">
              {{ meal.notes }}
            </div>
          </div>
        </el-card>

      </div>
    </div>

  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'MealsList',

  props: {
    mealsList: { type: Object, required: true },
    caloriesTotal: { type: Number, required: true },
    isFetchingList: { type: Boolean, required: true },
    selectedUserId: { type: String, required: true },
  },

  filters: {
    filterTime(date) {
      const [hours, minutes] = date.toTimeString().split(':');
      return `${hours}:${minutes}`;
    },
  },

  computed: {
    ...mapState('meals', ['removingIds']),
    ...mapState('users', ['usersList']),
    ...mapGetters('users', ['myself']),

    exceedGoal() {
      if (!this.mealsList[this.selectedUserId]) return;
      const calSum = this.mealsList[this.selectedUserId] // Only when 1 user
        // eslint-disable-next-line no-return-assign, no-param-reassign
        .reduce((sum, meal) => sum += meal.calories, 0);
      return this.selectedUser.dailyCalories - calSum < 0;
    },

    hasMeals() {
      return Object.keys(this.mealsList).length;
    },

    selectedUser() {
      return this.usersList[this.selectedUserId] || {};
    },
  },

  methods: {
    ...mapActions('meals', ['removeMeal']),

    handleRemoveMeal(mealId, eatenAt) {
      this.$confirm('Remove it for sure?', 'Warning', {
        confirmButtonText: 'Yes!',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        const dayString = utils.getDayString(eatenAt);
        this.removeMeal({ mealId, dayString });
      }).catch((err) => {
        console.error(err);
      });
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
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media screen and (max-width: $break-center) {
      justify-content: center;
    }
  }

  .meal-card {
    .el-card__body {
      padding-top: 10px;
    }
  }
}
</style>
