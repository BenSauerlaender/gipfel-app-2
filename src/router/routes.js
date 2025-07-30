const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/timeline' },
      { path: '/login', component: () => import('src/pages/others/LoginPage.vue') },
      { path: '/status', component: () => import('src/pages/others/StatusPage.vue') },
      { path: '/timeline', component: () => import('pages/TimelinePage.vue') },
      { path: '/stats', component: () => import('src/pages/statPages/StatsPage.vue') },
      {
        path: '/stats/routes',
        component: () => import('src/pages/statPages/StatsDetailRoutesPage.vue'),
      },
      {
        path: '/stats/summits',
        component: () => import('src/pages/statPages/StatsDetailSummitsPage.vue'),
      },
      { path: '/regions', component: () => import('src/pages/AllRegionsPage.vue') },
      {
        path: '/regions/:id',
        component: () => import('src/pages/detailPages/DetailRegionPage.vue'),
      },
      { path: '/summits', component: () => import('src/pages/AllSummitsPage.vue') },
      {
        path: '/summits/:id',
        component: () => import('src/pages/detailPages/DetailSummitPage.vue'),
      },
      { path: '/routes/:id', component: () => import('src/pages/detailPages/DetailRoutePage.vue') },
      { path: '/map/:id?', component: () => import('pages/MapPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/others/ErrorNotFound.vue'),
    name: '404',
  },
]

export default routes
