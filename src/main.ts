import Vue from 'vue'
import App from '@/App.vue'
import './registerServiceWorker'
import router from '@/router'
import store, { ActionTypes } from '@/store'
import vuetify from '@/plugins/vuetify';
import api from '@/plugins/api';
import '@/plugins/validator';

Vue.config.productionTip = false

async function main() {
  await store.dispatch(ActionTypes.STARTUP);
  api.errorHandler = (error) => {
    store.dispatch(ActionTypes.HANDLE_API_ERROR, error);
  };

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}
main();

