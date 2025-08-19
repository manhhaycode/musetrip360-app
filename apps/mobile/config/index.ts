import { initAuthEndpoints } from '@musetrip360/auth-system/api';
import { initEnv, StorageFactory } from '@musetrip360/infras';
import { MMKVStorage } from './mmkv.storage';

export const initConfigApp = () => {
  StorageFactory.setClient(new MMKVStorage());
  initEnv(process.env, 'expo');
  initAuthEndpoints();
  // Additional configurations can be added here
};
