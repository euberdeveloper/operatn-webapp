import { OperaTN } from 'operatn-api-client';
import { Validator } from '@/plugins/validator';
import { Stored } from '@/plugins/stored';


declare module 'vue/types/vue' {
    import Vue from 'vue';

    interface Vue {
        $api: OperaTN;
        $validator: Validator;
        $stored: Stored;
    }
}