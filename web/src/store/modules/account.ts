/* eslint-disable no-param-reassign */

import { MutationTree, Module, ActionTree, GetterTree } from 'vuex';
import Vue from 'vue';

import * as apiBase from '@/api/apiBase';
import * as api from '@/api/account';
import * as types from '../types';

import RootInterface from './@types/rootState';
import { State, DoLoginActionArgs } from './@types/account';

const initialState: State = {
  user: {
    userId: '',
  },
  isAuthenticating: false,
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
    localStorage.setItem('token', data.token);
    apiBase.updateAuthHeader();
  },
  [types.LOGIN_FAIL](state, error: ErrorEvent) {
    state.isAuthenticating = false;
    console.error(error);
  },

  doLogout() {
    apiBase.logoutUser();
  },

};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
