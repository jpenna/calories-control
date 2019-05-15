import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';

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
      component: () => import(/* webpackChunkName: "auth" */ './views/Authenticated.vue'),
      children: [{
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "auth" */ './views/Home/index.vue'),
      }, {
        path: '/account',
        name: 'account',
        component: () => import(/* webpackChunkName: "auth" */ './views/Account/index.vue'),
      }],
    },
  ],
});
