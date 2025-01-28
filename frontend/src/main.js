import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap"
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from "./routes/router"

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
