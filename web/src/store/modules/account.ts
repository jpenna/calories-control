/* eslint-disable no-param-reassign */

import { MutationTree, ActionTree } from 'vuex';

import * as api from '@/api/account';
import * as types from '../types';
import { ApiResponseError } from '@/api/apiBase';

import * as utils from '@/helpers/utils';

import { RootInterface, Account } from './@types';

function mapUser(user: api.UserRes): Account.UserInterface {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    permissions: user.permissions,
    dailyCalories: user.dailyCalories,
  };
}

const initialState: Account.AccountState = {
  user: {
    id: '',
    name: '',
    email: '',
    permissions: [],
    dailyCalories: 0,
  },

  isFetchingMe: false,
  meError: {},
};

const actions: ActionTree<Account.AccountState, RootInterface> = {
  async fetchMe({ commit }) {
    commit(types.FETCH_ME);
    api.fetchMe()
      .then((data: api.FetchMeRes) => {
        commit(types.FETCH_ME_DONE, data.user);
      })
      .catch((error: ApiResponseError) => {
        commit(types.FETCH_ME_FAIL, error);
      });
  },
};

const mutations: MutationTree<Account.AccountState> = {
  // Me
  [types.FETCH_ME](state) {
    state.isFetchingMe = true;
    state.meError = {};
  },
  [types.FETCH_ME_DONE](state, user: api.UserRes) {
    state.isFetchingMe = false;
    state.user = mapUser(user);
  },
  [types.FETCH_ME_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;
    state.isFetchingMe = false;
    state.meError = { status, message, code };
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
