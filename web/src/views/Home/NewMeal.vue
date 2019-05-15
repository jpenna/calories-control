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
      :before-close="handleClose"
    >

      <span>This is a message</span>


      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">Cancel</el-button>
        <el-button type="primary" @click="show = false">Confirm</el-button>
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
    };
  },
});
</script>
