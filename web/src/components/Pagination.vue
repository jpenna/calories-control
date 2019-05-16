<template>
  <el-pagination
    :current-page="page"
    :page-size="size"
    :pager-count="11"
    :total="total"
    :layout="layout"
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
    @prev-click="handlePageChange"
    @next-click="handlePageChange"
  />
</template>

<script>
import { updateUserSettings, getUserSettings } from '@/helpers/utils';

export default {
  props: {
    settingsKey: { type: String, default: '' },
    startPage: { type: Number, default: 0 },
    total: { type: Number, default: null },
  },

  data() {
    return {
      page: this.startPage || +this.$route.query.page || 1,
      size: getUserSettings(this.settingsKey).size || 20,
      sizeChanged: false,
    };
  },

  computed: {
    layout() {
      const layout = ['sizes'];
      if (this.total > this.size) {
        layout.push('prev, pager, next, jumper');
      }
      layout.push('->, total');
      return layout.join(',');
    },
  },

  mounted() {
    this.onChange();
  },

  methods: {
    handlePageChange(page) {
      this.$router.push({ query: { page } });
      this.page = page;
      this.onChange();
    },

    handleSizeChange(size) {
      this.sizeChanged = true;
      this.size = size;
      if (this.settingsKey) updateUserSettings(this.settingsKey, { size });
      this.onChange();
    },

    getPageValues() {
      let firstItem = (this.page - 1) * this.size;

      // Show all
      if (this.size >= this.total) firstItem = 0;
      // Complete table with previous values if last rows are empty
      else if (this.sizeChanged) {
        this.sizeChanged = false;
        const diff = (firstItem + this.size) - this.total;
        if (diff > 0) firstItem -= diff;
      }

      return { firstItem, tableSize: this.size };
    },

    onChange() {
      this.$emit('change', this.getPageValues());
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  padding: 15px;
  text-align: center;
}
</style>
