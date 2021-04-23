import { RuoloUtente } from 'operatn-api-client';
import Vue from 'vue';
import { PluginObject } from 'vue/types/umd';
import { InputValidationRule } from 'vuetify';

const validator = {
    requiredText(name: string): InputValidationRule {
        return value => !!value || `${name} è un campo obbligatorio`;
    },
    nomeUtente(): InputValidationRule {
        return value => /^[\w.]+$/.test(value) || `Sono ammesse solo lettere, numeri e punto`;
    },
    ruoloUtente(): InputValidationRule {
        return value => Object.values(RuoloUtente).includes(value) || `Ruolo utente non valido`;
    },
    email(): InputValidationRule {
        return value => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value) || `Email non valida`;
    }
};

export type Validator = typeof validator;


const validatorPlugin: PluginObject<any> = {
    install: function (Vue) {
        Vue.prototype.$validator = validator;
    }
}

Vue.use(validatorPlugin);

export default validator;