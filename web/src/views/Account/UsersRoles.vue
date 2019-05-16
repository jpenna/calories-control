<template>
  <div>
    <h2>Roles</h2>

    <!-- User List -->
    <div v-for="user of usersList" :key="user.email">
      <div>
        <div>{{ user.name }}</div>
        <div>{{ user.email }}</div>
      </div>
      <div>
        <el-select v-model="user.role">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
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
