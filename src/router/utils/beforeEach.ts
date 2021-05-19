import { NavigationGuard } from 'vue-router';
import { RuoloUtente } from 'operatn-api-client';
import store, { ActionTypes } from '@/store';

const beforeEach: NavigationGuard = function (to, _from, next) {
    const ruolo: RuoloUtente | null = store.getters.role;
    const allowed = to.matched.reduce((prev: RuoloUtente[], curr) => curr.meta.authentication
        ? [...prev, ...curr.meta.authentication]
        : prev, []);

    if (!allowed.length || allowed.includes(ruolo as string)) {
        next();
    }
    else {
        if (ruolo !== null) {
            store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `L'utente non ha i permessi per accedere a questa pagina, provare rimuovendo la parte che inizia con ? nella barra dell'url`);
        }
        next({ name: 'login', query: { requestedRoute: to.path } });
    }
}

export default beforeEach;