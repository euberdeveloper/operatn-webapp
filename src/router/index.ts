import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { RuoloUtente } from 'operatn-api-client';

import rootRedirect from './utils/rootRedirect';
import beforeEach from './utils/beforeEach';

/* LOGIN */
import Login from '@/views/login/LoginView.vue';

/* ADMIN */
import Admin from '@/views/admin/AdminView.vue';
import AdminBar from '@/views/admin/AdminBarView.vue';
import AdminMenu from '@/views/admin/AdminMenuView.vue';
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
