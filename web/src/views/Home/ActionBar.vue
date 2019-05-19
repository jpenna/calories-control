<template>
  <div class="action-bar">
    <div class="flex-split" style="align-items: flex-start">

      <el-form ref="form" :model="form" label-position="left" class="filters-side">
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

        <el-button
          type="primary"
          round
          class="time-button"
          :class="{ 'no-button': !useTimeFilter }"
          @click="$emit('update:useTimeFilter', !useTimeFilter)"
          size="mini"
        >
          <img src="@/assets/emojis/clock.png" style="height: 1.2rem" />
          <span class="time-text">Time filter</span>
        </el-button>

        <!-- Time -->
        <el-form-item label="Time" v-show="useTimeFilter">
          <el-time-picker
            is-range
            v-model="localTimeRange"
            :clearable="false"
            range-separator="-"
            start-placeholder="Start time"
            end-placeholder="End time"
            format="HH:mm"
            @change="$emit('update:timeRange', $event)"
          />
        </el-form-item>

        <!-- User -->
        <!-- <el-form-item label="User">
          <el-select v-model="form.user">
            <el-option
              v-for="item in usersList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->

      </el-form>

      <!-- New Meal -->
      <div class="new-meal-side">
        <el-button type="primary" @click="$emit('update:showMealModal', true)">
          <img src="@/assets/emojis/salad.png" style="height: 1.2rem" />
          <span>New Meal</span>
        </el-button>
      </div>

    </div>
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'FilterMeals',

  props: {
    date: { type: Date, required: true },
    timeRange: { type: Array, required: true },
    showMealModal: { type: Boolean, required: true },
    useTimeFilter: { type: Boolean, required: true },
  },

  data() {
    return {
      localTimeRange: this.timeRange,

      form: {
        user: 1,
      },
      usersList: [
        { label: 'User 1', value: 1 },
        { label: 'User 2', value: 2 },
      ],
    };
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
.action-bar {
  .date-item {
    display: inline-block;
    margin-right: 20px;

    .el-form-item__content {
      display: inline-block;
    }
  }

  @media screen and (max-width: 600px) {
    .new-meal-side {
      order: 1;
      text-align: right;
      width: 100%;
      margin-bottom: 20px;
    }

    .filters-side {
      order: 2;
      margin-bottom: 20px;

      .date-item {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }

  @media screen and (max-width: 450px) and (min-width: 370px) {
    .time-button span {
      margin-left: 0;
    }

    .time-text {
      display: none;
    }
  }

  @media screen and (max-width: 370px) {
    .filters-side {
      text-align: center;
    }

    .time-button {
      margin-bottom: 10px;
    }
  }
}
</style>
