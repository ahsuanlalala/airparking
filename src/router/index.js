import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import detail from '../views/detail.vue'
import detailAll from '../views/detailAll.vue'
import login from '@/views/login.vue'
import member from '../views/member.vue'
import password from  '../views/password.vue'
import report from '../views/report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail/All',
    name: 'detailAll',
    component: detailAll
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/detail/:monthType',
    name: 'detail',
    component: detail
  },
  {
    path: '/member',
    name: 'member',
    component: member
  },
  {
    path: '/password',
    name: 'password',
    component: password
  },
  {
    path: '/report',
    name: 'report',
    component: report
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const acc = localStorage.getItem("userAcc");
  const pwd = localStorage.getItem("userPwd")
  if (to.name !== 'login' && (!acc || !pwd)) {
    return next({
      path: '/login'
    })
  }
  if (to.name === 'login' && (acc && pwd)) {
    return next({
      path: '/'
    })
  }
  next()
})

export default router
