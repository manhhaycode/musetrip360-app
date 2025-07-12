import { initAuthEndpoints } from '@musetrip360/auth-system';
import { initEnv } from '@musetrip360/infras';

export const initConfigApp = () => {
  initEnv(import.meta.env, 'vite');
  initAuthEndpoints();
  // Additional configurations can be added here
};
