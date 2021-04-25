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
    password(): InputValidationRule {
        return (value: string) => {
            if (!value) {
                return false;
            }
            if (value.length < 8) {
                return 'Minimo 8 caratteri';
            }
            if (value.length > 32) {
                return 'Massimo 32 caratteri';
            }
            if (!/\d/.test(value)) {
                return 'Almeno un numero';
            }
            if (!/[a-z]/.test(value)) {
                return 'Almeno una minuscola';
            }
            if (!/[A-Z]/.test(value)) {
                return 'Almeno una maiuscola';
            }
            if (!/[@$!%*?&]/.test(value)) {
                return 'Almeno un carattere speciale fra @$!%*?&';
            }
            return true;
        }
    },
    passwordsCoincide(pwd: string): InputValidationRule {
        return value => { console.log(pwd); return value === pwd || 'Le password devono coincidere' };
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