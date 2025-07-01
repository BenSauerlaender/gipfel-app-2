const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/stats' },
      { path: '/timeline', component: () => import('pages/TimelinePage.vue') },
      { path: '/stats', component: () => import('pages/StatsPage.vue') },
      { path: '/stats/routes', component: () => import('pages/StatsRoutesPage.vue') },
      { path: '/stats/summits', component: () => import('pages/StatsSummitsPage.vue') },
      { path: '/regions', component: () => import('pages/RegionsPage.vue') },
      { path: '/regions/:id', component: () => import('pages/DetailRegionPage.vue') },
      { path: '/summits', component: () => import('pages/SummitsPage.vue') },
      { path: '/summits/:id', component: () => import('pages/DetailSummitPage.vue') },
    ]
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'), name: '404'
  }
]

export default routes
