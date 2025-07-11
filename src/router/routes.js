const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/timeline' },
      { path: '/status', component: () => import('pages/StatusPage.vue') },
      { path: '/timeline', component: () => import('pages/TimelinePage.vue') },
      { path: '/stats', component: () => import('pages/StatsPage.vue') },
      { path: '/stats/routes', component: () => import('pages/StatsRoutesPage.vue') },
      { path: '/stats/summits', component: () => import('pages/StatsSummitsPage.vue') },
      { path: '/regions', component: () => import('pages/RegionsPage.vue') },
      { path: '/regions/:id', component: () => import('pages/DetailRegionPage.vue') },
      { path: '/summits', component: () => import('pages/SummitsPage.vue') },
      { path: '/summits/:id', component: () => import('pages/DetailSummitPage.vue') },
      { path: '/routes/:id', component: () => import('pages/DetailRoutePage.vue') },
      { path: '/map/:id?', component: () => import('pages/MapPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: '404',
  },
]

export default routes
