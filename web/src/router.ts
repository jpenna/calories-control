import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/Authentication/Login.vue';
import Register from './views/Authentication/Register.vue';
import Container from './views/Authentication/Container.vue';

import Authenticated from './views/Authenticated.vue';
import Home from './views/Home/index.vue';
import Account from './views/Account/index.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Container,
      children: [{
        path: '',
        name: 'login',
        component: Login,
      }, {
        path: '/register',
        name: 'register',
        component: Register,
      }],

    }, {
      path: '/',
      alias: '/home',
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

    {
      path: '*',
      redirect: '/',
    },
  ],
});
