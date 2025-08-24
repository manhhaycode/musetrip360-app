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
  payments: {
    orders: '/payments/orders',
    plans: '/payments/plans',
    subscriptions: 'payments/subscriptions',
    payouts: 'payments/payouts',
  },
};

export default routes;
