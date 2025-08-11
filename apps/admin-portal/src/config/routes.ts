const routes = {
  dashboard: '/',
  museums: {
    list: '/museums/admin',
    detail: (id: string) => `/museums/admin/${id}`,
    approval: '/museums/requests/admin',
  },
  users: '/users',
  settings: '/settings',
  policies: '/policies',
};

export default routes;
