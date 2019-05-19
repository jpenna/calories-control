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

function getRole(permissions: string[]) {
  const { length } = permissions;
  if (!length) return 'user';
  if (length === 2) return 'admin';
  if (length === 1 && permissions[0] === 'users_edit') return 'manager';
  return 'custom';
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

  isUpdatingUser: false,
  updateError: {},

  removingUsersIds: [],
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

  async updateUser({ commit }, params) {
    commit(types.UPDATE_CALORIES);
    const { userId, ...update } = params;
    api.updateUser(userId, update)
      .then((data: api.UpdateUserRes) => {
        commit(types.UPDATE_CALORIES_DONE, data.user);
      })
      .catch((error: ApiResponseError) => {
        commit(types.UPDATE_CALORIES_FAIL, error);
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
  [types.UPDATE_CALORIES](state) {
    state.isUpdatingUser = true;
    state.updateError = {};
  },
  [types.UPDATE_CALORIES_DONE](state, user: api.UserRes) {
    state.isUpdatingUser = false;
    const mapped = mapUser(user);
    state.usersList[mapped.id] = mapped;
    window.$notifyGlobal({
      title: 'Profile updated!',
      type: 'success',
    });
  },
  [types.UPDATE_CALORIES_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isUpdatingUser = false;
    state.updateError = { status, message, code };
    window.$notifyGlobal({
      title: 'Something went wrong',
      message: `Error ${code || status}: ${message}`,
      type: 'error',
    });
  },

  // Update Calories
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
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
};
