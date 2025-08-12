import { initAuthEndpoints } from '@musetrip360/auth-system';
import { initEnv } from '@musetrip360/infras';

export const envConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  SIGNALING_SERVER_URL: process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL,
  LOGGING_REQUEST: process.env.NEXT_PUBLIC_LOGGING_REQUEST,
  TURN_SERVER_URL: process.env.NEXT_PUBLIC_TURN_SERVER_URL,
};

export const initConfigApp = () => {
  initEnv(envConfig, 'nextjs');
  initAuthEndpoints();
  // Additional configurations can be added here
};
