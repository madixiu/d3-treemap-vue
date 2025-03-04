import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Other from '../views/Other.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/other',
    name: 'Other',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Other
  }
]

const router = new VueRouter({
  routes
})

export default router
