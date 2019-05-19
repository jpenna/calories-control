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
            :disabled="item.disabled"
          />
        </el-select>
        <el-tooltip effect="light" content="Delete" :open-delay="500">
          <el-button type="text" class="ml-10" @click="handleRemoveUser(user.id)">
            <img
              v-if="!removingUsersIds.includes(user.id)"
              src="@/assets/emojis/times.png"
              style="height: 1.2rem"
            />
            <i v-else class="el-icon-loading" />
          </el-button>
        </el-tooltip>
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

<script lang="js">
import Vue from 'vue';

import Pagination from '@/components/Pagination.vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'UsersRoles',

  components: {
    Pagination,
  },

  data() {
    return {
      isUpdatingRole: false,

      roles: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
        { label: 'Custom Permissions', value: 'custom', disabled: true },
      ],
    };
  },

  computed: {
    ...mapState('users', ['usersList', 'removingUsersIds']),
    ...mapGetters('users', ['myself']),

    usersRolesList() {
      return Object.keys(this.usersList).map((id) => {
        const role = 'admin';
        const user = this.usersList[id];
        return { name: user.name, email: user.email, role };
      });
    },
  },

  methods: {
    ...mapActions('users', ['removeUser']),

    handleRemoveUser(userId) {
      const { name } = this.usersList[userId];
      this.$confirm(`Remove "${name}" for sure?`, 'Warning', {
        confirmButtonText: 'Yes!',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.removeUser(userId);
      }).catch((err) => {
        console.error(err);
      });
    },
  },
});
</script>
