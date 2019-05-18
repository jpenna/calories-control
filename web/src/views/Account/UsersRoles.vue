<template>
  <div class="user-roles">
    <h2>Roles</h2>

    <!-- User List -->
    <div v-for="user of usersList" :key="user.email" class="flex-split separate-list">
      <div>{{ user.name }}</div>
      <div>{{ user.email }}</div>
      <div>
        <el-select v-model="user.role">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <i
          class="ml-10 fs-150 v-align-middle"
          :class="{
            'el-icon-loading': isUpdatingRole,
            'el-icon-success color-success': !isUpdatingRole, // and no error
            'el-icon-error color-danger': !isUpdatingRole, // and error
          }"
        />
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      class="mt-30"
      settingsKey="users-list"
      :startPage="0"
      :total="50"
    />

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Pagination from '@/components/Pagination.vue';

export default Vue.extend({
  name: 'UsersRoles',

  components: {
    Pagination,
  },

  data() {
    return {
      isUpdatingRole: false,

      usersList: [
        { name: 'John', email: 'john@me.com', role: 'admin' },
        { name: 'Mary', email: 'mary@me.com', role: 'manager' },
      ],

      roles: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
      ],
    };
  },
});
</script>
