<template>
  <div>
    <h1>Account</h1>

    <!-- Calories goal -->
    <el-form ref="form" :model="form" label-position="top" @submit="submitCalories">
      <el-form-item label="Calories Goal">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="form.calories"
          name="calories"
        />
        <i class="el-icon-success" />
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Account',

  data() {
    return {
      form: {
        calories: 0,
      },
    };
  },

  methods: {
    submitCalories() {
      console.log('submit');
    },
  },
});
</script>
