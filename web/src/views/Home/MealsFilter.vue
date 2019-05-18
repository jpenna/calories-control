<template>
  <el-form ref="form" :model="form" label-position="left">
    <!-- Date -->
    <el-form-item label="Date">
      <el-date-picker
        :value="date"
        :clearable="false"
        type="date"
        @input="$emit('update:date', $event)"
      />
    </el-form-item>

    <!-- Time -->
    <el-form-item label="Time">
      <el-time-picker
        is-range
        :value="timeRange"
        :clearable="false"
        range-separator="To"
        start-placeholder="Start time"
        end-placeholder="End time"
        format="HH:mm"
        @input="$emit('update:timeRange', $event)"
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
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FilterMeals',

  props: {
    date: { type: Date, required: true },
    timeRange: { type: Array, required: true },
  },

  data() {
    return {
      form: {
        user: 1,
      },
      usersList: [
        { label: 'User 1', value: 1 },
        { label: 'User 2', value: 2 },
      ],
    };
  },
});
</script>
