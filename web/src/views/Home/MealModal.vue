<template>
  <div class="meal-modal">
    <!-- Button -->
    <el-button @click="show = true">
      New Meal
    </el-button>

    <!-- Modal -->
    <el-dialog
      title="New Meal"
      :center="true"
      :visible.sync="show"
      :show-close="showFullScreen"
      :fullscreen="showFullScreen"
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

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'NewMeal',

  data() {
    return {
      show: false,
      showFullScreen: utils.getWidth() <= 550,

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

  mounted() {
    window.addEventListener('resize', () => {
      this.showFullScreen = utils.getWidth() <= 550;
    });
  },

  methods: {
    submitNewMeal() {
      this.show = false;
    },
  },
});
</script>

<style lang="scss">
.meal-modal {
  @media screen and (min-width: 550px) {
    .el-dialog {
      min-width: 500px;
    }
  }
}
</style>
