/* eslint-disable no-param-reassign */

import { MutationTree, ActionTree, GetterTree } from 'vuex';

import * as api from '@/api/account';
import * as types from '../types';
import { ApiResponseError } from '@/api/apiBase';

import * as utils from '@/helpers/utils';

import { RootInterface, Users } from './@types';

function mapUser(user: api.UserRes): Users.UserInterface {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    permissions: user.permissions,
    dailyCalories: user.dailyCalories,
  };
}

const initialState: Users.UsersState = {
  usersList: {},

  isFetchingMe: false,
  usersError: {},
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
};

const mutations: MutationTree<Users.UsersState> = {
  // Me
  [types.FETCH_USERS](state) {
    state.isFetchingMe = true;
    state.usersError = {};
  },
  [types.FETCH_USERS_DONE](state, users: api.FetchUsersRes['users']) {
    state.isFetchingMe = false;
    state.usersList = users.reduce((acc: { [id:string]: Users.UserInterface }, user) => {
      const norm = mapUser(user);
      acc[norm.id] = norm;
      return acc;
    }, {});
  },
  [types.FETCH_USERS_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isFetchingMe = false;
    state.usersError = { status, message, code };
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
};
