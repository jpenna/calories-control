<template>
  <el-form ref="form" :model="form" label-position="top" :inline="true">
    <!-- Date -->
    <el-form-item label="Date">
      <el-date-picker
        v-model="form.date[0]"
        type="date"
      />
    </el-form-item>

    <!-- Time -->
    <el-form-item label="Time">
      <el-time-picker
        is-range
        v-model="form.date"
        range-separator="To"
        start-placeholder="Start time"
        end-placeholder="End time"
      />
    </el-form-item>

    <!-- User -->
    <el-form-item label="User">
      <el-select v-model="form.user">
        <el-option
          v-for="item in usersList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FilterMeals',

  data() {
    return {
      form: {
        date: [new Date(), new Date()],
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
