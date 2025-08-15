const routes = {
  dashboard: '/',
  museums: {
    list: '/museums/admin',
    detail: (id: string) => `/museums/admin/${id}`,
    requests: '/museums/requests',
    requestDetail: (id: string) => `/museums/requests/${id}`,
  },
  users: '/users',
  settings: '/settings',
  policies: '/policies',
  rolebase: {
    roles: '/rolebase/roles',
    permissions: '/rolebase/permissions',
  },
};

export default routes;
