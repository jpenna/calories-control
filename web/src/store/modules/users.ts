/* eslint-disable no-param-reassign */

import Vue from 'vue';
import { MutationTree, ActionTree, GetterTree } from 'vuex';

import * as api from '@/api/users';
import * as types from '../types';
import { ApiResponseError } from '@/api/apiBase';

import { RootInterface, Users } from './@types';

const permissionMap = new Map([
  ['users_edit', 'usersEdit'],
  ['meals_all', 'mealsAll'],
]);

const rolesMap = new Map([
  ['admin', ['users_edit', 'meals_all']],
  ['manager', ['users_edit']],
  ['user', []],
]);

function getRole(permissions: string[]) {
  const { length } = permissions;
  if (!length) return 'user';
  if (length === 2) return 'admin';
  if (length === 1 && permissions[0] === 'users_edit') return 'manager';
  return 'Custom Permissions';
}

function mapUser(user: api.UserRes): Users.UserInterface {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    permissions: user.permissions.map(p => permissionMap.get(p) || p),
    role: getRole(user.permissions),
    dailyCalories: user.dailyCalories,
  };
}

const initialState: Users.UsersState = {
  usersList: {},

  isFetchingUsers: false,
  usersError: {},

  updatingUsers: {},
  updateError: {},

  removingUsersIds: [],

  isChangingPassword: false,
  passwordError: {},
};

const getters: GetterTree<Users.UsersState, RootInterface> = {
  myself(state, localGetters, rootState): Users.UserInterface {
    return state.usersList[rootState.auth.userId] || {};
  },
};

const actions: ActionTree<Users.UsersState, RootInterface> = {
  async fetchUsersList({ commit }) {
    commit(types.FETCH_USERS);
    api.fetchUsersList()
      .then((data: api.FetchUsersRes) => {
        commit(types.FETCH_USERS_DONE, data.users);
      })
      .catch((error: ApiResponseError) => {
        commit(types.FETCH_USERS_FAIL, error);
      });
  },

  async updateUser({ commit, rootState }, params) {
    const { userId, role, ...update } = params;
    commit(types.UPDATE_USER, userId);
    if (role) update.permissions = rolesMap.get(role);
    api.updateUser(userId, update)
      .then((data: api.UpdateUserRes) => {
        commit(types.UPDATE_USER_DONE, {
          user: data.user,
          isMember: rootState.auth.id !== userId,
        });
      })
      .catch((error: ApiResponseError) => {
        commit(types.UPDATE_USER_FAIL, error);
      });
  },

  async changePassword({ commit }, params: { password: string, newPassword: string }) {
    commit(types.CHANGE_PASSWORD);
    api.changePassword(params)
      .then(() => {
        commit(types.CHANGE_PASSWORD_DONE);
      })
      .catch((error: ApiResponseError) => {
        commit(types.CHANGE_PASSWORD_FAIL, error);
      });
  },

  async removeUser({ commit }, userId: string) {
    commit(types.DELETE_USER, userId);
    api.deleteUser(userId)
      .then(() => {
        commit(types.DELETE_USER_DONE, userId);
      })
      .catch((error: ApiResponseError) => {
        commit(types.DELETE_USER_FAIL, { error, userId });
      });
  },
};

const mutations: MutationTree<Users.UsersState> = {
  // Users List
  [types.FETCH_USERS](state) {
    state.isFetchingUsers = true;
    state.usersError = {};
  },
  [types.FETCH_USERS_DONE](state, users: api.FetchUsersRes['users']) {
    state.isFetchingUsers = false;
    state.usersList = users.reduce((acc: { [id:string]: Users.UserInterface }, user) => {
      const norm = mapUser(user);
      acc[norm.id] = norm;
      return acc;
    }, {});
  },
  [types.FETCH_USERS_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isFetchingUsers = false;
    state.usersError = { status, message, code };
  },

  // Update User
  [types.UPDATE_USER](state, userId) {
    Vue.set(state.updatingUsers, userId, true);
    state.updateError = {};
  },
  [types.UPDATE_USER_DONE](state, payload: { user: api.UserRes, isMember: boolean }) {
    const { user, isMember } = payload;
    const mapped = mapUser(user);
    Vue.set(state.updatingUsers, mapped.id, false);
    state.usersList[mapped.id] = mapped;
    window.$notifyGlobal({
      title: isMember ? 'User updated!' : 'Profile updated!',
      message: isMember ? `User ${mapped.name} updated.` : '',
      type: 'success',
    });
  },
  [types.UPDATE_USER_FAIL](state, params: { error: ApiResponseError, userId: string }) {
    const { error, userId } = params;
    const { status, message, code } = error.apiError;
    Vue.set(state.updatingUsers, userId, false);
    state.updateError = { status, message, code };
    window.$notifyGlobal({
      title: 'Something went wrong',
      message: `Error ${code || status}: ${message}`,
      type: 'error',
    });
  },

  // Delete User
  [types.DELETE_USER](state, userId) {
    state.removingUsersIds.push(userId);
  },
  [types.DELETE_USER_DONE](state, userId: string) {
    const { name } = state.usersList[userId];
    Vue.delete(state.usersList, userId);
    Vue.delete(state.removingUsersIds, state.removingUsersIds.findIndex(id => id === userId));
    window.$messageGlobal(`User "${name}" removed!`);
  },
  [types.DELETE_USER_FAIL](state, params: { error: ApiResponseError, userId: string }) {
    const { error, userId } = params;
    const { status, message, code } = error.apiError;
    Vue.delete(state.removingUsersIds, state.removingUsersIds.findIndex(id => id === userId));
    window.$notifyGlobal({
      title: 'Something went wrong',
      message: `Error ${code || status}: ${message}`,
      type: 'error',
    });
  },

  // Change Password
  [types.CHANGE_PASSWORD](state) {
    state.isChangingPassword = true;
    state.passwordError = {};
  },
  [types.CHANGE_PASSWORD_DONE](state) {
    state.isChangingPassword = false;
  },
  [types.CHANGE_PASSWORD_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isChangingPassword = false;
    state.passwordError = { status, message, code };
    window.$notifyGlobal({
      title: 'Something went wrong',
      message: `Error ${code || status}: ${message}`,
      type: 'error',
    });
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
};
