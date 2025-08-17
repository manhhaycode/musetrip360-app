import { initAuthEndpoints } from '@musetrip360/auth-system/api';
import { initEnv } from '@musetrip360/infras';

export const initConfigApp = () => {
  initEnv(process.env, 'expo');
  initAuthEndpoints();
  // Additional configurations can be added here
};
