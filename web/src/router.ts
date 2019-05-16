import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';

import Authenticated from './views/Authenticated.vue';
import Home from './views/Home/index.vue';
import Account from './views/Account/index.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },

    {
      path: '/home',
      props: { auth: true },
      component: Authenticated,
      children: [{
        path: '',
        name: 'home',
        component: Home,
      }, {
        path: '/account',
        name: 'account',
        component: Account,
      }],
    },
  ],
});
