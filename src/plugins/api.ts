import Vue from 'vue';
import { OperaTN } from "operatn-api-client";
import CONFIG from '@/config';

const api = new OperaTN(CONFIG.API_URL, null, null);

const apiPlugin = {
    install: function (Vue) {
        Vue.prototype.$api = api;
    }
}

Vue.use(apiPlugin);

export default api;