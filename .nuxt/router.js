import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _03ef26c7 = () => interopDefault(import('../pages/callback.vue' /* webpackChunkName: "pages/callback" */))
const _063bfbfc = () => interopDefault(import('../pages/dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _1f2ce3ae = () => interopDefault(import('../pages/library.vue' /* webpackChunkName: "pages/library" */))
const _30c96f57 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _d39dd64e = () => interopDefault(import('../pages/rechercher.vue' /* webpackChunkName: "pages/rechercher" */))
const _28d6952a = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _6721cc40 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _5f94a874 = () => interopDefault(import('../pages/artist/_id.vue' /* webpackChunkName: "pages/artist/_id" */))
const _51ab3d7f = () => interopDefault(import('../pages/playlist/_id.vue' /* webpackChunkName: "pages/playlist/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/callback",
    component: _03ef26c7,
    name: "callback"
  }, {
    path: "/dashboard",
    component: _063bfbfc,
    name: "dashboard"
  }, {
    path: "/library",
    component: _1f2ce3ae,
    name: "library"
  }, {
    path: "/login",
    component: _30c96f57,
    name: "login"
  }, {
    path: "/rechercher",
    component: _d39dd64e,
    name: "rechercher"
  }, {
    path: "/search",
    component: _28d6952a,
    name: "search"
  }, {
    path: "/",
    component: _6721cc40,
    name: "index"
  }, {
    path: "/artist/:id?",
    component: _5f94a874,
    name: "artist-id"
  }, {
    path: "/playlist/:id?",
    component: _51ab3d7f,
    name: "playlist-id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
