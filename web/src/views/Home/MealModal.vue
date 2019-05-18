<template>
  <div class="meal-modal">
    <!-- Button -->
    <el-button @click="show = true">
      New Meal
    </el-button>

    <!-- Modal -->
    <el-dialog
      :visible.sync="show"
      :fullscreen="showFullScreen"
    >
      <h2 slot="title" class="mb-0 mt-0">
        What did you eat?
      </h2>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        hide-required-asterisk
        @submit="submitNewMeal"
      >
        <!-- Name -->
        <el-form-item label="Name" prop="name">
          <el-input placeholder="Meal name" v-model="form.name" />
        </el-form-item>

        <!-- Date -->
        <el-form-item label="Eaten at" prop="eatenAt">
          <el-date-picker
            v-model="date"
            :clearable="false"
            type="date"
            format="MMMM, dd"
          />

            <!-- Time -->
          <el-time-picker
            v-model="time"
            :clearable="false"
            format="HH:mm"
          />
        </el-form-item>

        <!-- Calories -->
        <el-form-item label="Calories" prop="calories">
          <el-input-number
            :controls="false"
            :min="0"
            placeholder="How many calories?"
            v-model="form.calories"
          />
        </el-form-item>

        <!-- Notes -->
        <el-form-item label="Notes" prop="notes">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            placeholder="Anything you want to record..."
            v-model="form.notes"
            show-word-limit
            :maxlength="100"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer text-right">
        <el-button type="text" @click="show = false" class="mr-30">Cancel</el-button>
        <el-button type="primary" @click="submitNewMeal" icon="el-icon-knife-fork">
          Eaten!
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'EditMeal',

  data() {
    return {
      show: false,
      showFullScreen: utils.getWidth() <= 550,

      date: new Date(),
      time: new Date(),

      form: {
        name: '',
        eatenAt: new Date(),
        calories: undefined,
        userId: 'this user id',
        notes: '',
      },

      rules: {
        name: [{ required: true, type: 'string', trigger: 'submit', message: 'Please insert the dish name.' }],
        eatenAt: [{ required: true, type: 'date', trigger: 'submit', message: 'Select a valid time and date.' }],
        calories: [{ required: true, type: 'number', min: 0, trigger: 'submit', message: 'Calories is required.' }],
        userId: [{ required: true, trigger: 'submit', message: 'Select a user.' }],
        notes: [{ trigger: 'submit', max: 100, message: 'Maximum of 100 characters.' }],
      },
    };
  },

  computed: {
    'form.eatenAt'() {
      return new Date();
    },
  },

  watch: {
    show(show) {
      if (!show) {
        // Wait for modal to disappear before clearing
        setTimeout(this.$refs.form.resetFields(), 200);
      }
    },

    date: {
      immediate: true,
      handler(date) {
        this.form.eatenAt.setFullYear(date.getYear(), date.getMonth(), date.getDate());
      },
    },

    time: {
      immediate: true,
      handler(date) {
        this.form.eatenAt.setHours(date.getHours());
        this.form.eatenAt.setMinutes(date.getMinutes());
        this.form.eatenAt.setSeconds(0);
      },
    },
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.showFullScreen = utils.getWidth() <= 550;
    });
  },

  methods: {
    submitNewMeal() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // this.doLogin({
        //   email: this.form.email,
        //   password: this.form.password,
        // });
        this.show = true;
      });
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
