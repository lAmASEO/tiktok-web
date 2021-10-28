import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import Antd from 'ant-design-vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { parseTime } from '@/utils/index'

import '@/icons' // icon
import '@/permission' // permission control

//引入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const {
    mockXHR
  } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, {
  locale
})
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(Antd)

Vue.config.productionTip = false

import ysMyPage from './components/tools/myPage.vue'

// 组件库设置
Vue.component('YsMyPage', ysMyPage)

// 全局组件
// Vue.filter('getTime', function(value) {
//   if (value === '') return ''
//   const date = new Date(value)
//   const time = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + '  ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()))
//   return time
// })
Vue.filter('getTime', parseTime)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
