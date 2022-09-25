import Vue from 'vue'
import App from './App'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import {store} from '../store'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const toastOptions = {
  // You can set your default options here
}

Vue.use(PerfectScrollbar)
Vue.use(Toast, toastOptions)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
