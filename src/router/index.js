import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountSettingView from '../views/AccountSettingView.vue'
import GoAccountView from '@/views/GoAccountView.vue'
import SettingView from '@/views/SettingView.vue'
import PlayView from '@/views/PlayView.vue'
import DeviceView from '@/views/DeviceView.vue'
import AboutView from '../views/AboutView.vue'
import { useStorage } from '@vueuse/core'
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  //hash模式
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
        title: '欢迎'
      }
    },
    {
      path: '/About',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView,
      meta: {
        requiresAuth: false,
        title: '关于'
      }
    },
    {
      path: '/goAccount',
      name: 'goAccount',
      component:  GoAccountView
    },
    {
      path: '/AccountSetting',
      name: 'AccountSetting',
      component: AccountSettingView,
      meta: {
        requiresAuth: false,
        title: '账号设置'
      }
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: SettingView,
      meta: {
        requiresAuth: true,
        title: '设置'
      }
    },
    {
      path: '/Play',
      name: 'Play',
      component: PlayView,
      meta: {
        requiresAuth: true,
        title: '播放'
      }
    },
    {
      path: '/Device/:did',
      name: 'Device',
      component: DeviceView,
      meta: {
        requiresAuth: true,
        title: '设备'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  /* 页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  /* 判断该路由是否需要账号信息 */
    // 假设我们有一个方法来检查用户是否已经登录
    const hasAccount =useStorage('AccountState', false)
  // console.log('%csrc\router\index.js:87 hasAccount', 'color: #007acc;',localStorage.getItem('AccountState'));
  // 如果用户访问登录页面或注册页面，允许访问
    if (to.name !== 'goAccount' && to.name !== 'AccountSetting' && !hasAccount) {
      // 如果用户未登录，重定向到登录页面
      next('/goAccount');
    } else {
      // 如果用户已登录或正在访问登录页面，正常导航
      next();
    }  

})
export default router
