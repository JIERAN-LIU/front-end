import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import store from './store/store'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI, { size: 'mini', locale })
Vue.config.productionTip = false
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox


window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})