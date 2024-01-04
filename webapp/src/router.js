import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import About from './views/About.vue'
import NotFoundPage from './components/NotFoundPage.vue'
import { clearAuthToken, isLoggedIn } from './utils/auth'

// Vue.use(Router)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter(to, from, next) {
        clearAuthToken()
        next('/login')
      },
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name == 'login' && isLoggedIn()) {
    console.log('redirecting to /')
    next({ path: '/' })
  }
  else if (!to.meta.allowAnonymous && !isLoggedIn()) {
    console.log('redirecting to /login')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else {
    console.log('router next()')
    next()
  }
})

export default router