/* eslint-disable no-param-reassign */

import { MutationTree, ActionTree, GetterTree } from 'vuex';

import * as api from '@/api/users';
import * as types from '../types';
import { ApiResponseError } from '@/api/apiBase';

import { RootInterface, Users } from './@types';

const permissionMap = new Map([
  ['users_edit', 'usersEdit'],
  ['meals_all', 'mealsAll'],
]);

function mapUser(user: api.UserRes): Users.UserInterface {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    permissions: user.permissions.map(p => permissionMap.get(p) || p),
    dailyCalories: user.dailyCalories,
  };
}

const initialState: Users.UsersState = {
  usersList: {},
  rolesList: {},

  isFetchingUsers: false,
  usersError: {},

  isUpdatingCalories: false,
  updateError: {},

  isFetchingRoles: false,
  rolesError: {},
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

  async updateCalories({ commit }, params: { userId: string, calories: number }) {
    commit(types.UPDATE_CALORIES);
    const { calories, userId } = params;
    const update = { dailyCalories: calories };
    api.updateUser(userId, update)
      .then((data: api.UpdateUserRes) => {
        commit(types.UPDATE_CALORIES_DONE, data.user);
      })
      .catch((error: ApiResponseError) => {
        commit(types.UPDATE_CALORIES_FAIL, error);
      });
  },

  async fetchRoles({ commit }) {
    commit(types.FETCH_ROLES);
    api.fetchRoles()
      .then((data: api.FetchRolesRes) => {
        commit(types.FETCH_ROLES_DONE, data.roles);
      })
      .catch((error: ApiResponseError) => {
        commit(types.FETCH_ROLES_FAIL, error);
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

  // Roles
  [types.FETCH_ROLES](state) {
    state.isFetchingRoles = true;
    state.rolesError = {};
  },
  [types.FETCH_ROLES_DONE](state, roles: api.FetchRolesRes['roles']) {
    state.isFetchingRoles = false;
    state.rolesList = roles;
  },
  [types.FETCH_ROLES_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isFetchingRoles = false;
    state.rolesError = { status, message, code };
  },

  // Update Calories
  [types.UPDATE_CALORIES](state) {
    state.isUpdatingCalories = true;
    state.updateError = {};
  },
  [types.UPDATE_CALORIES_DONE](state, user: api.UserRes) {
    state.isUpdatingCalories = false;
    const mapped = mapUser(user);
    state.usersList[mapped.id] = mapped;
    window.$notifyGlobal({
      title: 'Calories updated!',
      message: `Your daily maximum is ${mapped.dailyCalories} now.`,
      type: 'success',
    });
  },
  [types.UPDATE_CALORIES_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isUpdatingCalories = false;
    state.updateError = { status, message, code };
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
