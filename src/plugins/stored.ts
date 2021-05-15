import Vue from 'vue';
import CONFIG from '@/config';

export interface Stored {
    getPath: (path: string) => string;
}

const stored: Stored = {
    getPath(path: string): string {
        return `${CONFIG.STORED_URL}/${path}`;
    }
}


const storedPlugin = {
    install: function (Vue) {
        Vue.prototype.$stored = stored;
    }
}

Vue.use(storedPlugin);

export default stored;