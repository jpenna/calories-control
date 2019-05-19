<template>
  <!-- Modal -->
  <el-dialog
    :visible="show"
    :fullscreen="showFullScreen"
    class="meal-modal"
    @close="$emit('update:show', false)"
    @closed="onModalClosed"
  >
    <h2 slot="title" class="mb-0 mt-0">
      <img src="@/assets/emojis/delicious.png" class="mr-5" style="height: 2rem; vertical-align: sub" />
      What did you eat?
    </h2>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="90px"
      hide-required-asterisk
      @submit.native.prevent="submitNewMeal"
    >
      <!-- Name -->
      <el-form-item label="Name" prop="name">
        <el-input placeholder="Meal name" v-model="form.name" />
      </el-form-item>

      <!-- Date -->
      <el-form-item label="Eaten on" prop="eatenAt">
        <el-date-picker
          v-model="date"
          :clearable="false"
          type="date"
          format="MMMM, dd"
          class="time-block"
        />

          <!-- Time -->
        <el-time-picker
          v-model="time"
          :clearable="false"
          format="HH:mm"
          class="time-block"
        />
      </el-form-item>

      <!-- Calories -->
      <el-form-item label="Calories" prop="calories">
        <el-input-number
          :controls="false"
          :min="0"
          placeholder="How many?"
          class="calories-input"
          v-model="form.calories"
        />
        <span v-show="form.calories" class="ml-10">
          cal.
        </span>
      </el-form-item>

      <!-- Notes -->
      <el-form-item label="Notes" prop="notes" class="mb-0">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2}"
          placeholder="Anything you want to record?"
          v-model="form.notes"
          show-word-limit
          :maxlength="100"
        />
      </el-form-item>

      <div class="dialog-footer text-right mt-20">
        <el-button type="text" @click="$emit('update:show', false)" class="mr-30">Cancel</el-button>
        <el-button type="primary" native-type="submit" @click="submitNewMeal" :loading="isSubmitting">
          <img src="@/assets/emojis/thumbs_up.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
          Eaten!
        </el-button>
      </div>
    </el-form>

  </el-dialog>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

import * as utils from '@/helpers/utils';

export default Vue.extend({
  name: 'EditMeal',

  props: {
    show: { type: Boolean, required: true },
    selectedMeal: { type: Object, required: true },
  },

  data() {
    return {
      showFullScreen: utils.getWidth() <= 550,

      date: new Date(),
      time: new Date(),

      form: {
        id: '',
        name: '',
        eatenAt: new Date(),
        calories: undefined,
        userId: this.userId,
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
    ...mapState('auth', ['userId']),
    ...mapState('meals', ['isSubmitting', 'submitError']),
  },

  watch: {
    isSubmitting(isSubmitting) {
      if (isSubmitting) return;
      if (!this.submitError.status) {
        this.$emit('update:show', false);
        this.$notify({
          title: 'New meal added!',
          message: `${this.form.name} - ${this.form.calories} calories`,
          type: 'success',
        });
      }
    },

    date: {
      immediate: true,
      handler(date) {
        this.form.eatenAt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
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

    selectedMeal(meal) {
      if (!meal.id) return;
      this.form = {
        id: meal.id,
        name: meal.name,
        eatenAt: meal.eatenAt, // Just for completeness. It will be calculated next
        calories: meal.calories,
        userId: meal.userId,
        notes: meal.notes,
      };
      this.date = meal.eatenAt;
      this.time = meal.eatenAt;
    },
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.showFullScreen = utils.getWidth() <= 550;
    });
  },

  methods: {
    ...mapActions('meals', ['newMeal']),

    submitNewMeal() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (this.form.id) return console.log('update');
        this.newMeal({
          userId: this.userId,
          name: this.form.name,
          notes: this.form.notes,
          calories: this.form.calories,
          eatenAt: this.form.eatenAt,
        });
      });
    },

    onModalClosed() {
      this.$refs.form.resetFields();
      this.$emit('close');
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

  // Remove border
  .time-block {
    input {
      border: none;
    }
  }

  // Align calories input
  .calories-input {
    width: 110px;
    input {
      text-align: right;
    }
  }
}
</style>
