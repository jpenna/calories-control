<template>
  <div class="users-list">
    <h2>Users</h2>

    <!-- User List -->
    <table class="responsive-table">

      <tr
        v-for="user of usersList"
        :key="user.email"
        class="user-item"
      >
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td class="text-center">{{ user.dailyCalories }} cal.</td>

        <td>
          <el-select
            v-loading="updatingUsers[user.id]"
            v-model="usersRole[user.id]"
            :disabled="user.id === myself.id"
            @change="updateRole(user.id, $event)"
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>

          <el-tooltip v-if="user.id !== myself.id" effect="light" content="Edit" :open-delay="500">
            <el-button type="text" class="ml-15" @click="handleEditMember(user.id)">
              <img src="@/assets/emojis/pencil.png" style="height: 1.2rem" />
            </el-button>
          </el-tooltip>

          <el-tooltip v-if="user.id !== myself.id" effect="light" content="Delete" :open-delay="500">
            <el-button type="text" class="ml-15" @click="handleRemoveUser(user.id)">
              <img
                v-if="!removingUsersIds.includes(user.id)"
                src="@/assets/emojis/times.png"
                style="height: 1.2rem"
              />
              <i v-else class="el-icon-loading" />
            </el-button>
          </el-tooltip>
        </td>

      </tr>

    </table>

    <MemberModal :show.sync="showEditMember" :member="selectedMember" @close="handleMemberClose" />
  </div>
</template>

<script lang="js">
import Vue from 'vue';

import { mapState, mapGetters, mapActions } from 'vuex';

import MemberModal from './MemberModal.vue';

export default Vue.extend({
  name: 'UsersList',

  components: {
    MemberModal,
  },

  data() {
    return {
      isUpdatingRole: false,

      showEditMember: false,
      selectedMember: {},

      usersRole: {},

      roles: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
      ],
    };
  },

  computed: {
    ...mapState('users', ['usersList', 'removingUsersIds', 'updatingUsers']),
    ...mapGetters('users', ['myself']),
  },

  watch: {
    usersList: {
      immediate: true,
      handler(usersList) {
        Object.keys(usersList).forEach((id) => {
          const user = usersList[id];
          this.$set(this.usersRole, id, user.role);
        });
      },
    },
  },

  methods: {
    ...mapActions('users', ['removeUser', 'updateUser']),

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

    handleEditMember(userId) {
      this.showEditMember = true;
      this.selectedMember = this.usersList[userId];
    },

    updateRole(userId, role) {
      this.updateUser({ userId, role });
    },

    handleMemberClose() {
      this.showEditMember = false;
      this.selectedMember = {};
    },
  },
});
</script>

<style lang="scss">
.users-list {
  table {
    width: 100%;
    padding: 0 20px;
    border-collapse: separate;
    border-spacing: 10px 20px;

    tr td:last-child {
      text-align: right;
    }
  }
}
</style>
