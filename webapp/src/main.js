import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.baseURL = "PASTE API GATEWAY ENDPOINT HERE"

createApp(App).use(router).mount('#app')
