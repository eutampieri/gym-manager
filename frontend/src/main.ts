import "bootstrap/dist/css/bootstrap.css"
import "bootstrap"
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from "./routes/router"
import { VueResponsiveness, Presets } from 'vue-responsiveness'

createApp(App)
    .use(router)
    .use(createPinia())
    .use(VueResponsiveness, Presets.Bootstrap_5)
    .mount('#app');
