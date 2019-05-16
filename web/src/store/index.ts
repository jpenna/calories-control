import Vue from 'vue';
import Vuex from 'vuex';

// Types
import RootInterface from './modules/@types/rootState';

// Modules
import account from './modules/account';

Vue.use(Vuex);

export default new Vuex.Store<RootInterface>({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    account,
  },
});
