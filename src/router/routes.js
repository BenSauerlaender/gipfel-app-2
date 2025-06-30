const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/timeline', component: () => import('pages/TimelinePage.vue') },
      { path: '/stats', component: () => import('pages/StatsPage.vue') },
      { path: '/summits', component: () => import('pages/SummitPage.vue') },
      { path: '/routes', component: () => import('pages/RoutesPage.vue') }
    ]
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
