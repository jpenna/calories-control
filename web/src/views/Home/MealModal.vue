<template>
  <!-- Modal -->
  <el-dialog
    :visible="show"
    :fullscreen="showFullScreen"
    class="meal-modal"
    :close-on-click-modal="false"
    @open="form.userId = form.userId || myself.id"
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
      @submit.native.prevent
    >
      <!-- User -->
      <el-form-item v-if="$hasRole('mealsAll', myself)" label="User">
        <el-select v-model="form.userId">
          <el-option
            v-for="item in usersList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

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
          v-model="form.notes"
          type="textarea"
          placeholder="Anything you want to record?"
          show-word-limit
          :autosize="{ minRows: 2}"
          :maxlength="100"
        />
      </el-form-item>

      <div class="dialog-footer text-right mt-20">
        <el-button type="text" @click="$emit('update:show', false)" class="mr-30" :disabled="isSubmitting">Cancel</el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmitMeal" :loading="isSubmitting">
          <img src="@/assets/emojis/thumbs_up.png" class="mr-5" style="height: 1rem; vertical-align: sub" />
          Eaten!
        </el-button>
      </div>
    </el-form>

  </el-dialog>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';

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
        userId: '',
        name: '',
        eatenAt: new Date(),
        calories: undefined,
        notes: '',
      },

      rules: {
        name: [{ required: true, type: 'string', trigger: 'submit', message: 'Please insert the dish name.' }],
        eatenAt: [{ required: true, type: 'date', trigger: 'submit', message: 'Select a valid time and date.' }],
        calories: [{ required: true, type: 'number', min: 0, trigger: 'submit', message: 'Calories is required.' }],
        notes: [{ trigger: 'submit', max: 100, message: 'Maximum of 100 characters.' }],
      },
    };
  },

  computed: {
    ...mapState('meals', ['isSubmitting', 'submitError']),
    ...mapState('users', ['usersList']),
    ...mapGetters('users', ['myself']),
  },

  watch: {
    isSubmitting(isSubmitting) {
      if (isSubmitting) return;
      if (!this.submitError.status) {
        this.$emit('update:show', false);
        this.$notify({
          title: this.selectedMeal.id ? 'Meal updated!' : 'New meal added!',
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
        userId: meal.userId,
        name: meal.name,
        eatenAt: new Date(),
        calories: meal.calories,
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
    ...mapActions('meals', ['submitMeal']),

    handleSubmitMeal() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const dayString = this.selectedMeal.id && utils.getDayString(this.selectedMeal.eatenAt);
        this.submitMeal({
          dayString,
          meal: {
            id: this.form.id,
            userId: this.form.userId,
            name: this.form.name,
            notes: this.form.notes,
            calories: this.form.calories,
            eatenAt: this.form.eatenAt,
          },
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
