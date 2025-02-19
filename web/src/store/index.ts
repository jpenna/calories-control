import Vue from 'vue';
import Vuex from 'vuex';

// Types
import { RootInterface } from './modules/@types';

// Modules
import auth from './modules/auth';
import meals from './modules/meals';
import users from './modules/users';

Vue.use(Vuex);

export default new Vuex.Store<RootInterface>({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    meals,
    users,
  },
});
