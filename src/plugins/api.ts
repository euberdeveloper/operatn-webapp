import Vue from 'vue';
import { OperaTN } from "operatn-api-client";
import { PluginObject } from 'vue/types/umd';

const api = new OperaTN('http://192.168.1.7:3000/api', null, null);

const apiPlugin: PluginObject<any> = {
    install: function (Vue) {
        Vue.prototype.$api = api;
    }
}

Vue.use(apiPlugin);

export default api;