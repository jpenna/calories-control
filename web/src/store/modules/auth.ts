/* eslint-disable no-param-reassign */

import { MutationTree, Module, ActionTree, GetterTree } from 'vuex';
import Vue from 'vue';

import * as api from '@/api/auth';
import * as types from '../types';

import * as utils from '@/helpers/utils';

import RootInterface from './@types/rootState';
import { State, DoLoginActionArgs, DoRegisterActionArgs } from './@types/auth';

const initialState: State = {
  userId: '',
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

  async doRegister({ commit }, { name, email, password }: DoRegisterActionArgs) {
    commit(types.REGISTER);
    api.doRegister({ name, email, password })
      .then((data: api.DoRegisterResInterface) => {
        commit(types.REGISTER_DONE, data);
      })
      .catch((error: ErrorEvent) => {
        commit(types.REGISTER_FAIL, error);
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
    state.userId = data.userId;

    localStorage.setItem('token', data.token);
    api.updateAuthHeader();
  },
  [types.LOGIN_FAIL](state, error: ErrorEvent) {
    state.isAuthenticating = false;
    console.error(error);
  },

  // Register (same as Login)
  [types.REGISTER](state) {
    state.isAuthenticating = true;
    mutations[types.LOGIN](state);
  },
  [types.REGISTER_DONE](state, data: api.DoRegisterResInterface) {
    mutations[types.LOGIN_DONE](state, data);
  },
  [types.REGISTER_FAIL](state, error: ErrorEvent) {
    mutations[types.LOGIN_FAIL](state, error);
  },

  doLogout() {
    api.logoutUser();
  },

};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
