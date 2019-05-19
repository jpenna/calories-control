<template>
  <div class="action-bar">
    <div class="flex-split" style="align-items: flex-start">

      <el-form label-position="left" class="filters-side" inline>
        <!-- Date -->
        <el-form-item label="Date" class="date-item">
          <el-date-picker
            :value="date"
            :clearable="false"
            type="date"
            format="dddd, MMM dd, yyyy"
            @input="$emit('update:date', $event)"
          />
        </el-form-item>

        <!-- User -->
        <el-form-item v-if="$hasRole('mealsAll', myself)" label="User" class="ml-20 mr-20">
          <el-select :value="userId" @change="$emit('update:userId', $event)">
            <el-option
              v-for="item in optionsUsers"
              :class="{ 'fw-700': !item.value }"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- So it won't grow when the input is visible -->
        <div style="min-height: 42px">
          <el-button
            type="primary"
            round
            class="time-button"
            style="vertical-align: top"
            :class="{ 'no-button': !useTimeFilter }"
            @click="$emit('update:useTimeFilter', !useTimeFilter)"
            size="mini"
          >
            <img src="@/assets/emojis/clock.png" style="height: 1.2rem" />
            <span>Time filter</span>
          </el-button>

          <!-- Time -->
          <el-form-item class="d-inline-block ml-15 mb-0">
            <el-time-picker
              is-range
              v-show="useTimeFilter"
              v-model="localTimeRange"
              :clearable="false"
              range-separator="-"
              start-placeholder="Start time"
              end-placeholder="End time"
              format="HH:mm"
              @change="$emit('update:timeRange', $event)"
            />
          </el-form-item>
        </div>

      </el-form>

      <!-- New Meal -->
      <div class="new-meal-side">
        <div class="mb-10">
          <el-button type="primary" @click="$emit('update:showMealModal', true)">
            <img src="@/assets/emojis/salad.png" style="height: 1.2rem" />
            <span>New Meal</span>
          </el-button>
        </div>

        <el-tooltip effect="light" content="Force list refresh" :open-delay="500">
          <el-button @click="$emit('forceRefresh')" :loading="isRefreshing">
            <img src="@/assets/emojis/drink.png" style="height: 1.2rem" />
            <span>{{ isRefreshing ? 'Loading' : 'Refresh'}}</span>
          </el-button>
        </el-tooltip>
      </div>

    </div>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'FilterMeals',

  props: {
    date: { type: Date, required: true },
    timeRange: { type: Array, required: true },
    showMealModal: { type: Boolean, required: true },
    useTimeFilter: { type: Boolean, required: true },
    isRefreshing: { type: Boolean, required: true },
    userId: { type: String, required: true },
  },

  data() {
    return {
      localTimeRange: this.timeRange,
    };
  },

  computed: {
    ...mapState('users', ['usersList']),
    ...mapGetters('users', ['myself']),

    optionsUsers() {
      return Object.keys(this.usersList).reduce((acc, id) => {
        acc.push({ label: this.usersList[id].name, value: this.usersList[id].id });
        return acc;
      }, [{ label: 'All', value: '' }]);
    },
  },

  watch: {
    useTimeFilter(use) {
      if (!use) {
        this.$emit('update:timeRange', [
          utils.setFirstTime(this.date),
          utils.setLastTime(this.date),
        ]);
      }
    },

    // To update parent only on submit. If parent cancel time, reset.
    timeRange(timeRange) {
      if (timeRange[0] !== this.localTimeRange[0] || timeRange[1] !== this.localTimeRange[1]) {
        this.localTimeRange = timeRange;
      }
    },
  },
});
</script>


<style lang="scss">
@import '@/styles/_variables.scss';

.action-bar {
  .date-item {
    display: inline-block;
    margin-right: 20px;

    .el-form-item__content {
      display: inline-block;
    }
  }

  .new-meal-side {
    text-align: right;
  }

  @media screen and (max-width: $break-center) {
    .new-meal-side {
      text-align: center;
      width: 100%;
      margin-bottom: 20px;

      div {
        display: inline-block;

        button {
          margin-right: 15px;
        }
      }
    }

    .filters-side {
      order: 1;
      margin-bottom: 20px;
      text-align: center;
      width: 100%;

      .date-item {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }

  @media screen and (max-width: 450px) and (min-width: 370px) {
    .time-button {
      margin-bottom: 10px;
    }
  }

  @media screen and (max-width: 400px) {
    .filters-side {
      text-align: center;
      width: 100%;
    }

    .new-meal-side {
      text-align: center;
      width: 100%;

      div {
        display: block;

        button {
          margin-right: 0;
        }
      }
    }

    .time-button {
      margin-bottom: 10px;
    }
  }
}
</style>
