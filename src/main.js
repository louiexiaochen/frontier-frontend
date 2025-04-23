import './assets/main.css'
import './assets/css/global.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import message from './utils/message'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia()
app.config.globalProperties.$message = message
app.use(pinia)
  .use(router)
  .use(i18n)
  .mount('#app')
