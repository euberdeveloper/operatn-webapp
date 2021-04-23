import { Store } from '@/store';

declare module 'vue/types/vue' {
    import Vue from 'vue';

    interface Vue {
        $store: Store;
    }
}