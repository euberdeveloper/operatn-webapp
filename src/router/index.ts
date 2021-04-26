import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { RuoloUtente } from 'operatn-api-client';

import rootRedirect from './utils/rootRedirect';
import beforeEach from './utils/beforeEach';

/* LOGIN */
import Login from '@/views/login/LoginView.vue';

/* PASSWORD RECOVERY */
import PasswordRecovery from '@/views/password-recovery/PasswordRecoveryView.vue';
import PasswordRecoveryToken from '@/views/password-recovery/token/PasswordRecoveryTokenView.vue';

/* ROOT */
import Root from '@/views/root/RootView.vue';
import RootBar from '@/views/root/RootBarView.vue';
import RootMenu from '@/views/root/RootMenuView.vue';
import RootUserInfo from '@/views/root/user-info/RootUserInfoView.vue';
import RootUtenti from '@/views/root/utenti/RootUtentiView.vue';
import RootTipiStanza from '@/views/root/tipi-stanza/RootTipiStanzaView.vue';
import RootTipiFabbricato from '@/views/root/tipi-fabbricato/RootTipiFabbricatoView.vue';
import RootQuietanzianti from '@/views/root/quietanzianti/RootQuietanziantiView.vue';
import RootTipiStudente from '@/views/root/tipi-studente/RootTipiStudenteView.vue';
import RootContiRicaviConsumi from '@/views/root/conti-ricavi-consumi/RootContiRicaviConsumiView.vue';
import RootContiRicaviCanoni from '@/views/root/conti-ricavi-canoni/RootContiRicaviCanoniView.vue';
import RootTipiTariffa from '@/views/root/tipi-tariffa/RootTipiTariffaView.vue';


/* ADMIN */
import Admin from '@/views/admin/AdminView.vue';
import AdminBar from '@/views/admin/AdminBarView.vue';
import AdminMenu from '@/views/admin/AdminMenuView.vue';
import AdminUserInfo from '@/views/admin/user-info/AdminUserInfoView.vue';
import AdminUtenti from '@/views/admin/utenti/AdminUtentiView.vue';
import AdminTipiStanza from '@/views/admin/tipi-stanza/AdminTipiStanzaView.vue';
import AdminTipiFabbricato from '@/views/admin/tipi-fabbricato/AdminTipiFabbricatoView.vue';
import AdminQuietanzianti from '@/views/admin/quietanzianti/AdminQuietanziantiView.vue';
import AdminTipiStudente from '@/views/admin/tipi-studente/AdminTipiStudenteView.vue';
import AdminContiRicaviConsumi from '@/views/admin/conti-ricavi-consumi/AdminContiRicaviConsumiView.vue';
import AdminContiRicaviCanoni from '@/views/admin/conti-ricavi-canoni/AdminContiRicaviCanoniView.vue';
import AdminTipiTariffa from '@/views/admin/tipi-tariffa/AdminTipiTariffaView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    redirect: rootRedirect
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/password-recovery',
    name: 'ask-password-recovery',
    component: PasswordRecovery
  },
  {
    path: '/password-recovery/:token',
    name: 'recover-password',
    component: PasswordRecoveryToken,
    props: true
  },
  {
    path: '/admin',
    components: {
      default: Admin,
      bar: AdminBar,
      menu: AdminMenu
    },
    meta: { authentication: [RuoloUtente.ADMIN] },
    children: [
      {
        path: '',
        redirect: 'utenti'
      },
      {
        path: 'user-info',
        name: 'admin-user-info',
        component: AdminUserInfo
      },
      {
        path: 'utenti',
        name: 'admin-utenti',
        component: AdminUtenti
      },
      {
        path: 'tipi-stanza',
        name: 'admin-tipi-stanza',
        component: AdminTipiStanza
      },
      {
        path: 'tipi-fabbricato',
        name: 'admin-tipi-fabbricato',
        component: AdminTipiFabbricato
      },
      {
        path: 'quietanzianti',
        name: 'admin-quietanzianti',
        component: AdminQuietanzianti
      },
      {
        path: 'tipi-studente',
        name: 'admin-tipi-studente',
        component: AdminTipiStudente
      },
      {
        path: 'conti-ricavi-consumi',
        name: 'admin-conti-ricavi-consumi',
        component: AdminContiRicaviConsumi
      },
      {
        path: 'conti-ricavi-canoni',
        name: 'admin-conti-ricavi-canoni',
        component: AdminContiRicaviCanoni
      },
      {
        path: 'tipi-tariffa',
        name: 'admin-tipi-tariffa',
        component: AdminTipiTariffa
      },
    ]
  },
  {
    path: '/root',
    components: {
      default: Root,
      bar: RootBar,
      menu: RootMenu
    },
    meta: { authentication: [RuoloUtente.ROOT] },
    children: [
      {
        path: '',
        redirect: 'utenti'
      },
      {
        path: 'user-info',
        name: 'root-user-info',
        component: RootUserInfo
      },
      {
        path: 'utenti',
        name: 'root-utenti',
        component: RootUtenti
      },
      {
        path: 'tipi-stanza',
        name: 'root-tipi-stanza',
        component: RootTipiStanza
      },
      {
        path: 'tipi-fabbricato',
        name: 'root-tipi-fabbricato',
        component: RootTipiFabbricato
      },
      {
        path: 'quietanzianti',
        name: 'root-quietanzianti',
        component: RootQuietanzianti
      },
      {
        path: 'tipi-studente',
        name: 'root-tipi-studente',
        component: RootTipiStudente
      },
      {
        path: 'conti-ricavi-consumi',
        name: 'root-conti-ricavi-consumi',
        component: RootContiRicaviConsumi
      },
      {
        path: 'conti-ricavi-canoni',
        name: 'admin-conti-ricavi-canoni',
        component: RootContiRicaviCanoni
      },
      {
        path: 'tipi-tariffa',
        name: 'root-tipi-tariffa',
        component: RootTipiTariffa
      },
    ]

  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    else if (savedPosition) {
      return savedPosition;
    }
    else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach(beforeEach);

export default router;
