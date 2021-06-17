import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/home',
      component: () => import('@/views/dashboard/index'),
      children: [
        {
          path: 'user',
          component: () => import('@/views/dashboard/user'),
          name: 'user'
        },
        {
          path: 'home',
          component: () => import('@/views/dashboard/manage/book'),
          name: 'home'
        },
        {
          path: 'book',
          component: () => import('@/views/dashboard/manage/book'),
          name: 'book'
        },
        {
          path: 'author',
          component: () => import('@/views/dashboard/manage/author'),
          name: 'author'
        },
        {
          path: 'publisher',
          component: () => import('@/views/dashboard/manage/publisher'),
          name: 'publisher'
        },
        {
          path: 'users',
          component: () => import('@/views/dashboard/manage/users'),
          name: 'users'
        },
        {
          path: 'college',
          component: () => import('@/views/dashboard/manage/college'),
          name: 'college'
        },
        {
          path: 'book-detail/:id',
          component: () => import('@/views/bookDetail/index')
        },
        {
          path: 'workbench',
          component: () => import('@/views/dashboard/workbench/borrow&return.vue'),
          name: 'workbench'
        },
        {
          path: 'author-detail/:id',
          component: () => import('@/views/authorDetail/index')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      meta: {
        isPublic: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { isPublic } = to.meta;
  const hasLogin = localStorage.getItem('user');
  document.title = to.name;
  if (!isPublic && !hasLogin) {
    next({
      path: '/login'
    })
  } else {
    if (to.name === 'home') {
      if (store.getters.isAdmin) {
        next('/dashboard/users')
      } else if (store.getters.isLibrarian) {
        next('/dashboard/workbench')
      } else {
        next();
      }
    } else {
      next();
    }
  }
})
export default router