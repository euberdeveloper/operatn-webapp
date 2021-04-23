import { NavigationGuard } from 'vue-router';
import { RuoloUtente } from 'operatn-api-client';
import store from '@/store';

const beforeEach: NavigationGuard = function (to, _from, next) {
    const ruolo: RuoloUtente | undefined = store.state.user?.ruolo;
    const allowed = to.matched.reduce((prev: RuoloUtente[], curr) => curr.meta.authentication
        ? [...prev, ...curr.meta.authentication]
        : prev, []);

    if (!allowed.length || allowed.includes(ruolo as string)) {
        next();
    }
    else {
        next({ name: 'login', query: { requestedRoute: to.path } });
    }
}

export default beforeEach;