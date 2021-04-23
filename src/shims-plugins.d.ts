import { OperaTN } from 'operatn-api-client';
import { Validator } from '@/plugins/validator';

declare module 'vue/types/vue' {
    import Vue from 'vue';

    interface Vue {
        $api: OperaTN;
        $validator: Validator;
    }
}