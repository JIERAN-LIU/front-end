import Vue from 'vue'
import Router from 'vue-router'

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
          path: 'home',
          component: () => import('@/views/dashboard/home'),
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
          path: 'college',
          component: () => import('@/views/dashboard/manage/college'),
          name: 'college'
        }
      ]
    },
    {
      path: '/book-detail/:id',
      component: () => import('@/views/bookDetail/index')
    },
    {
      path: '/author-detail/:id',
      component: () => import('@/views/authorDetail/index')
    },
    {
      path: '/login',
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
    next();
  }
})
export default router