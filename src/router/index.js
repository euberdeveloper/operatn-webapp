import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				path: '/ricerca-ospiti',
				component: () => import(/* webpackChunkName: "contratti" */ '@/views/portineria/RicercaOspiti.vue')
			},
			{
				path: '/alloggi-sparsi',
				component: () => import(/* webpackChunkName: "stanze" */ '@/views/Alloggi.vue')
			},
			{
				path: '/stanze',
				component: () => import(/* webpackChunkName: "stanze" */ '@/views/portineria/Stanze.vue')
			},
			{
				path: '/controlli',
				component: () => import(/* webpackChunkName: "contratti" */ '@/views/portineria/Controlli.vue')
			},
			{
				path: '/utenti',
				component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/GestioneUtenti.vue')
			},
			{
				path: '/inserisci-contratto',
				component: () => import(/* webpackChunkName: "inserimento-contratto" */ '@/views/sportello/InserimentoContratto.vue')
			},
			{
				path: '/presenze',
				component: () => import(/* webpackChunkName: "presenze" */ '@/views/sportello/Presenze.vue')
			},
			{
				path: '/bollette',
				component: () => import(/* webpackChunkName: "presenze" */ '@/views/ragioneria/Bollette.vue')
			},
			{
				path: '/ricerca-contratti',
				component: () => import(/* webpackChunkName: "presenze" */ '@/views/ragioneria/Contratti.vue')
			},
			{
				path: '/spese-servizi',
				component: () => import(/* webpackChunkName: "pulizie" */ '@/views/controllo/SpeseServizi.vue')
			},
			{
				path: '/guasti',
				component: () => import(/* webpackChunkName: "guasti" */ '@/views/controllo/Guasti.vue')
			},
			{
				path: '/firmatario',
				component: () => import(/* webpackChunkName: "firmatario" */ '@/views/admin/GestioneFirma.vue')
			},
			{
				path: '/aggiungi-persona',
				component: () => import(/* webpackChunkName: "aggiungi-persona" */ '@/views/sportello/AggiungiPersona.vue')
			},
			{
				path: '/inserimento-tariffa',
				component: () => import(/* webpackChunkName: "inserimento-tipo-contratto" */ '@/views/configurazioni/InserimentoTipoContratto.vue')
			},
			{
				path: '/inserimento-tipo-studente',
				component: () => import(/* webpackChunkName: "inserimento-tipo-studente" */ '@/views/configurazioni/InserimentoTipoStudente.vue')
			},
			{
				path: '/inserimento-tipo-utente',
				component: () => import(/* webpackChunkName: "inserimento-tipo-utente" */ '@/views/configurazioni/InserimentoTipoUtente.vue')
			},
			{
				path: '/tariffe',
				component: () => import(/* webpackChunkName: "inserimento-tipo-tariffa" */ '@/views/configurazioni/InserimentoTariffa.vue')
			},
		]
	},
	{
		path: "*",
		component: () => import(/* webpackChunkName: "notFound" */ '@/views/NotFound.vue')
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	// redirect to login page if not logged in and trying to access a restricted page
	const publicPages = ['/login'];
	const authRequired = !publicPages.includes(to.path);
	if (!store.getters['user/isLoggedIn'])
		store.dispatch('user/load')
	if (authRequired && !store.getters['user/isLoggedIn']) {
		return next('/login')
	}

	next()
})

export default router
