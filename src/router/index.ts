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
import RootContiRicavi from '@/views/root/conti-ricavi/RootContiRicaviView.vue';
import RootTipiTariffa from '@/views/root/tipi-tariffa/RootTipiTariffaView.vue';
import RootTipiOspite from '@/views/root/tipi-ospite/RootTipiOspiteView.vue';
import RootTipiContratto from '@/views/root/tipi-contratto/RootTipiContrattoView.vue';
import RootTipiBolletta from '@/views/root/tipi-bolletta/RootTipiBollettaView.vue';
import RootTariffe from '@/views/root/tariffe/RootTariffeView.vue';
import RootFabbricati from '@/views/root/fabbricati/RootFabbricatiView.vue';
import RootFabbricatiId from '@/views/root/fabbricati/id/RootFabbricatiIdView.vue';
import RootFabbricatiIdStanzeId from '@/views/root/fabbricati/id/stanze/id/RootFabbricatiIdStanzeIdView.vue';
import RootDipartimentiUnitn from '@/views/root/dipartimenti-unitn/RootDipartimentiUnitnView.vue';
import RootTabellone from '@/views/root/tabellone/RootTabelloneView.vue';
import RootTabelloneEsporta from '@/views/root/tabellone/esporta/RootTabelloneEsportaView.vue';
import RootTabelloneCronologia from '@/views/root/tabellone/cronologia/RootTabelloneCronologiaView.vue';
import RootContabilita from '@/views/root/contabilita/RootContabilitaView.vue';
import RootContabilitaInvia from '@/views/root/contabilita/invia/RootContabilitaInviaView.vue';
import RootContabilitaCronologia from '@/views/root/contabilita/cronologia/RootContabilitaCronologiaView.vue';
import RootContratti from '@/views/root/contratti/RootContrattiView.vue';


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
import AdminContiRicavi from '@/views/admin/conti-ricavi/AdminContiRicaviView.vue';
import AdminTipiTariffa from '@/views/admin/tipi-tariffa/AdminTipiTariffaView.vue';
import AdminTipiOspite from '@/views/admin/tipi-ospite/AdminTipiOspiteView.vue';
import AdminTipiContratto from '@/views/admin/tipi-contratto/AdminTipiContrattoView.vue';
import AdminTipiBolletta from '@/views/admin/tipi-bolletta/AdminTipiBollettaView.vue';
import AdminTariffe from '@/views/admin/tariffe/AdminTariffeView.vue';
import AdminFabbricati from '@/views/admin/fabbricati/AdminFabbricatiView.vue';
import AdminFabbricatiId from '@/views/admin/fabbricati/id/AdminFabbricatiIdView.vue';
import AdminFabbricatiIdStanzeId from '@/views/admin/fabbricati/id/stanze/id/AdminFabbricatiIdStanzeIdView.vue';
import AdminDipartimentiUnitn from '@/views/admin/dipartimenti-unitn/AdminDipartimentiUnitnView.vue';
import AdminTabellone from '@/views/admin/tabellone/AdminTabelloneView.vue';
import AdminTabelloneEsporta from '@/views/admin/tabellone/esporta/AdminTabelloneEsportaView.vue';
import AdminTabelloneCronologia from '@/views/admin/tabellone/cronologia/AdminTabelloneCronologiaView.vue';
import AdminContabilita from '@/views/admin/contabilita/AdminContabilitaView.vue';
import AdminContabilitaInvia from '@/views/admin/contabilita/invia/AdminContabilitaInviaView.vue';
import AdminContabilitaCronologia from '@/views/admin/contabilita/cronologia/AdminContabilitaCronologiaView.vue';

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
        path: 'conti-ricavi',
        name: 'admin-conti-ricavi',
        component: AdminContiRicavi
      },
      {
        path: 'tipi-tariffa',
        name: 'admin-tipi-tariffa',
        component: AdminTipiTariffa
      },
      {
        path: 'tipi-ospite',
        name: 'admin-tipi-ospite',
        component: AdminTipiOspite
      },
      {
        path: 'tipi-contratto',
        name: 'admin-tipi-contratto',
        component: AdminTipiContratto
      },
      {
        path: 'tipi-bolletta',
        name: 'admin-tipi-bolletta',
        component: AdminTipiBolletta
      },
      {
        path: 'dipartimenti-unitn',
        name: 'admin-dipartimenti-unitn',
        component: AdminDipartimentiUnitn
      },
      {
        path: 'tariffe',
        name: 'admin-tariffe',
        component: AdminTariffe
      },
      {
        path: 'fabbricati',
        name: 'admin-fabbricati',
        component: AdminFabbricati
      },
      {
        path: 'fabbricati/:fid',
        name: 'admin-fabbricati-id',
        component: AdminFabbricatiId,
        props: true
      },
      {
        path: 'fabbricati/:fid/stanze/:sid',
        name: 'admin-fabbricati-id-stanze-id',
        component: AdminFabbricatiIdStanzeId,
        props: true
      },
      {
        path: 'tabellone',
        component: AdminTabellone,
        children: [
          {
            path: '',
            redirect: 'esporta'
          },
          {
            path: 'esporta',
            name: 'admin-tabellone-esporta',
            component: AdminTabelloneEsporta
          },
          {
            path: 'cronologia',
            name: 'admin-tabellone-cronologia',
            component: AdminTabelloneCronologia
          }
        ]
      },
      {
        path: 'contabilita',
        component: AdminContabilita,
        children: [
          {
            path: '',
            redirect: 'invia'
          },
          {
            path: 'invia',
            name: 'admin-contabilita-invia',
            component: AdminContabilitaInvia
          },
          {
            path: 'cronologia',
            name: 'admin-contabilita-cronologia',
            component: AdminContabilitaCronologia
          }
        ]
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
        path: 'conti-ricavi',
        name: 'root-conti-ricavi',
        component: RootContiRicavi
      },
      {
        path: 'tipi-ospite',
        name: 'root-tipi-ospite',
        component: RootTipiOspite
      },
      {
        path: 'tipi-tariffa',
        name: 'root-tipi-tariffa',
        component: RootTipiTariffa
      },
      {
        path: 'tipi-contratto',
        name: 'root-tipi-contratto',
        component: RootTipiContratto
      },
      {
        path: 'tipi-bolletta',
        name: 'root-tipi-bolletta',
        component: RootTipiBolletta
      },
      {
        path: 'dipartimenti-unitn',
        name: 'root-dipartimenti-unitn',
        component: RootDipartimentiUnitn
      },
      {
        path: 'tariffe',
        name: 'root-tariffe',
        component: RootTariffe
      },
      {
        path: 'fabbricati',
        name: 'root-fabbricati',
        component: RootFabbricati
      },
      {
        path: 'fabbricati/:fid',
        name: 'root-fabbricati-id',
        component: RootFabbricatiId,
        props: true
      },
      {
        path: 'fabbricati/:fid/stanze/:sid',
        name: 'root-fabbricati-id-stanze-id',
        component: RootFabbricatiIdStanzeId,
        props: true
      },
      {
        path: 'tabellone',
        component: RootTabellone,
        children: [
          {
            path: '',
            redirect: 'esporta'
          },
          {
            path: 'esporta',
            name: 'root-tabellone-esporta',
            component: RootTabelloneEsporta
          },
          {
            path: 'cronologia',
            name: 'root-tabellone-cronologia',
            component: RootTabelloneCronologia
          }
        ]
      },
      {
        path: 'contabilita',
        component: RootContabilita,
        children: [
          {
            path: '',
            redirect: 'invia'
          },
          {
            path: 'invia',
            name: 'root-contabilita-invia',
            component: RootContabilitaInvia
          },
          {
            path: 'cronologia',
            name: 'root-contabilita-cronologia',
            component: RootContabilitaCronologia
          }
        ]
      },
      {
        path: 'contratti',
        name: 'root-contratti',
        component: RootContratti
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
