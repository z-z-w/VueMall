import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../views/GoodsList'
import Cart from '../views/Cart'
import Address from '../views/Address'
import OrderConfirm from '../views/OrderConfirm'
import OrderSuccess from '../views/OrderSuccess'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: GoodsList
    },
    {
      path: '/cart',
      component: Cart
    },
    {
      path: '/address',
      component: Address
    },
    {
      path: '/orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/OrderSuccess',
      component: OrderSuccess
    }
  ]
})