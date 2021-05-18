import { RuoloUtente } from 'operatn-api-client';
import Vue from 'vue';
import { PluginObject } from 'vue/types/umd';
import { InputValidationRule } from 'vuetify';

const validator = {
    requiredText(name: any): InputValidationRule {
        return value => (!!value || value === '0' || value === 0) || `${name} è un campo obbligatorio`;
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
        return value => (!value || value === pwd) || 'Le password devono coincidere';
    },
    ruoloUtente(): InputValidationRule {
        return value => (!value || Object.values(RuoloUtente).includes(value)) || `Ruolo utente non valido`;
    },
    email(): InputValidationRule {
        return value => (!value || /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value)) || `Email non valida`;
    },
    unique(values: string[]): InputValidationRule {
        return value => (!value || !values.includes(value)) || `Questo valore è già presente`;
    },
    max(n: number): InputValidationRule {
        return value => (!value || value.length <= n) || `La lunghezza massima è ${n}`
    },
    min(n: number): InputValidationRule {
        return value => (!value || value.length >= n) || `La lunghezza minima è ${n}`
    },
    length(n: number): InputValidationRule {
        return value => (!value || value.length === n) || `La lunghezza deve essere ${n}`
    },
    numeric(): InputValidationRule {
        return value => (!value || /^\d+$/.test(value)) || `Sono ammessi solo numeri`
    },
    number(): InputValidationRule {
        return value => (!value || !isNaN(+value)) || `Devi inserire un numero valido`
    },
    price(): InputValidationRule {
        return value => {
            const n = +value;
            if (!value) {
                return true;
            }
            if (isNaN(n)) {
                return 'Devi inserire un numero valido';
            }
            if (n < 0) {
                return 'Devi inserire un numero maggiore o uguale a zero';
            }
            const parts = n.toString().split('.');
            if (parts.length === 2 && parts[1].length > 2) {
                return 'Devi inserire un prezzo valido';
            }
            return true;
        }
    },
    maxSize(max: number): InputValidationRule {
        return value => (value === null || value.size <= max) || `La dimensione massima è di ${max} byte`
    },
};

export type Validator = typeof validator;


const validatorPlugin: PluginObject<any> = {
    install: function (Vue) {
        Vue.prototype.$validator = validator;
    }
}

Vue.use(validatorPlugin);

export default validator;