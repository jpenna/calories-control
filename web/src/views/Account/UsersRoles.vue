<template>
  <div>
    <h2>Roles</h2>

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

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'UsersRoles',

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
