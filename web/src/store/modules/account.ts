/* eslint-disable no-param-reassign */

import { MutationTree, Module, ActionTree, GetterTree } from 'vuex';
import Vue from 'vue';

import * as auth from '@/api/auth';
import * as api from '@/api/account';
import * as types from '../types';

import * as utils from '@/helpers/utils';

import RootInterface from './@types/rootState';
import { State, DoLoginActionArgs } from './@types/account';

const initialState: State = {
  user: {
    permissions: [],
    dailyCalories: 0,
    name: '',
    email: '',
    id: '',
  },
  isAuthenticating: false,
  isAuthenticated: utils.isAuthenticated(),
};

const actions: ActionTree<State, RootInterface> = {
  async doLogin({ commit }, { email, password }: DoLoginActionArgs) {
    commit(types.LOGIN);
    api.doLogin({ email, password })
      .then((data: api.DoLoginResInterface) => {
        commit(types.LOGIN_DONE, data);
      })
      .catch((error: ErrorEvent) => {
        commit(types.LOGIN_FAIL, error);
      });
  },
};

const mutations: MutationTree<State> = {
  // Login
  [types.LOGIN](state) {
    state.isAuthenticating = true;
  },
  [types.LOGIN_DONE](state, data: api.DoLoginResInterface) {
    state.isAuthenticating = false;
    state.isAuthenticated = true;
    state.user.id = data.userId;

    localStorage.setItem('token', data.token);
    auth.updateAuthHeader();
  },
  [types.LOGIN_FAIL](state, error: ErrorEvent) {
    state.isAuthenticating = false;
    console.error(error);
  },

  doLogout() {
    auth.logoutUser();
  },

};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
