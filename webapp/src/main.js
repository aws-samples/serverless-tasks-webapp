import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'

Vue.config.productionTip = false

axios.defaults.baseURL = "PASTE API GATEWAY ENDPOINT HERE"

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
