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

/* ADMIN */
import Admin from '@/views/admin/AdminView.vue';
import AdminBar from '@/views/admin/AdminBarView.vue';
import AdminMenu from '@/views/admin/AdminMenuView.vue';
import AdminUserInfo from '@/views/admin/user-info/AdminUserInfoView.vue';
import AdminUtenti from '@/views/admin/utenti/AdminUtentiView.vue';
import AdminTipiStanza from '@/views/admin/tipi-stanza/AdminTipiStanzaView.vue';
import AdminTipiFabbricato from '@/views/admin/tipi-fabbricato/AdminTipiFabbricatoView.vue';

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
      }
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
      }
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
