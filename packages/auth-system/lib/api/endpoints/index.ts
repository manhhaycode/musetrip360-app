import { getAuthEndpoints } from './auth';
export * from './auth';

export const initAuthEndpoints = () => {
  return {
    authEndpoints: getAuthEndpoints(),
  };
};
