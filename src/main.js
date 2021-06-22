import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
