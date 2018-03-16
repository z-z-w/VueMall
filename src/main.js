// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
Vue.config.productionTip = false;

import axios from 'axios'
Vue.prototype.$ajax = axios;

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-bars.svg"
});

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

import {currency} from './util/currency'
Vue.filter('currency', currency);

import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state, cartCount) {
      state.cartCount = cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
