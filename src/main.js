import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import store from './store'
import router from './router'
import axios from 'axios'

Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: 'https://10.0.0.75:3000/api/'
    })
    Vue.prototype.$api.interceptors.response.use(res => { return res}, err => {
      if (err.response.status === 403)
        alert('Il tuo utente non risulta autorizzato a compiere questa azione.')
      if (err.response.status === 401)
        alert('Il tuo utente non risulta autenticato')
      if (err.response.status >= 400)
        return Promise.reject(err)
      return err;
    })
  }
})

Vue.config.productionTip = false

require('./components');
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')