import { initAuthEndpoints } from '@musetrip360/auth-system';
import { initEnv } from '@musetrip360/infras';
import API from './API';
import routes from './routes';

const config = {
  routes,
  API,
};

export const initConfigApp = () => {
  initEnv(import.meta.env, 'vite');
  initAuthEndpoints();
  // Additional configurations can be added here
};

export default config;
