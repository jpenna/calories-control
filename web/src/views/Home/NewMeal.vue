<template>
  <div>
    <!-- Button -->
    <el-button @click="show = true">
      New Meal
    </el-button>

    <!-- Modal -->
    <el-dialog
      title="New Meal"
      :show-close="false"
      :center="true"
      :visible.sync="show"
    >

      <el-form ref="form" :model="form" label-position="top" @submit="submitNewMeal">
        <!-- Name -->
        <el-form-item label="Name">
          <el-input placeholder="Meal name" v-model="form.name" name="name" />
        </el-form-item>

        <!-- Date -->
        <el-form-item label="Eaten at">
          <el-date-picker
            v-model="form.date"
            type="date"
            format="MMMM, dd"
          />

            <!-- Time -->
          <el-time-picker
            v-model="form.time"
            format="HH:mm"
          />
        </el-form-item>

        <!-- Calories -->
        <el-form-item label="Calories">
          <el-input-number
            :controls="false"
            :min="0"
            placeholder="How many calories?"
            v-model="form.calories"
            name="calories"
          />
        </el-form-item>

        <!-- Notes -->
        <el-form-item label="Notes">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="Anything you want to record..."
            v-model="form.notes"
            name="notes"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">Cancel</el-button>
        <el-button type="primary" @click="submitNewMeal">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NewMeal',

  data() {
    return {
      show: false,

      form: {
        name: '',
        date: new Date(),
        time: new Date(),
        calories: '',
        userId: 'this user id',
        notes: '',
      },
    };
  },

  methods: {
    submitNewMeal() {
      this.show = false;
    },
  },
});
</script>
