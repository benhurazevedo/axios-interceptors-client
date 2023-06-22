import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Message from '../views/Message.vue'
import AcessoNegado from '../views/AcessoNegado.vue'
import api from '../services/axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: Message ,
    meta: { requiresAuth: true },
  },
  {
    path: '/acessonegado',
    name: 'acesso-negado',
    component: AcessoNegado ,
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem("token");

    if(!token)
    {
      try
      {
        api.login();
        next();
      }
      catch(e)
      {
        router.push('/acessonegado');
      }
    }
    else 
    {
      next()
    }
  } else {
    next()
  }
})

export default router
