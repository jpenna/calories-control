/* eslint-disable no-param-reassign */

import { MutationTree, ActionTree } from 'vuex';

import * as api from '@/api/auth';
import * as types from '../types';
import { ApiResponseError } from '@/api/apiBase';

import * as utils from '@/helpers/utils';

import { RootInterface, Auth } from './@types';

const initialState: Auth.AuthState = {
  userId: '',
  isAuthenticating: false,
  isAuthenticated: utils.isAuthenticated(),

  authError: {},
};

const actions: ActionTree<Auth.AuthState, RootInterface> = {
  async doLogin({ commit }, { email, password }: Auth.DoLoginActionArgs) {
    commit(types.LOGIN);
    api.doLogin({ email, password })
      .then((data: api.DoLoginResInterface) => {
        commit(types.LOGIN_DONE, data);
      })
      .catch((error: ApiResponseError) => {
        commit(types.LOGIN_FAIL, error);
      });
  },

  async doRegister({ commit }, { name, email, password, acceptTos }: Auth.DoRegisterActionArgs) {
    commit(types.REGISTER);
    api.doRegister({ name, email, password, acceptTos })
      .then((data: api.DoRegisterResInterface) => {
        commit(types.REGISTER_DONE, data);
      })
      .catch((error: ApiResponseError) => {
        commit(types.REGISTER_FAIL, error);
      });
  },
};

const mutations: MutationTree<Auth.AuthState> = {
  // Login
  [types.LOGIN](state) {
    state.isAuthenticating = true;
    state.authError = {};
  },
  [types.LOGIN_DONE](state, data: api.DoLoginResInterface) {
    state.isAuthenticating = false;
    state.isAuthenticated = true;
    state.userId = data.userId;

    localStorage.setItem('token', data.token);
    api.updateAuthHeader();
  },
  [types.LOGIN_FAIL](state, error: ApiResponseError) {
    const { status, message, code } = error.apiError;

    state.isAuthenticating = false;
    state.authError = { status, message, code };
  },

  // Register (same as Login)
  [types.REGISTER](state) {
    mutations[types.LOGIN](state);
  },
  [types.REGISTER_DONE](state, data: api.DoRegisterResInterface) {
    mutations[types.LOGIN_DONE](state, data);
  },
  [types.REGISTER_FAIL](state, error: ApiResponseError) {
    mutations[types.LOGIN_FAIL](state, error);
  },

  doLogout() {
    api.logoutUser();
  },

  clearAuthError(state) {
    state.authError = {};
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
