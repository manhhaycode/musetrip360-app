import { Fragment, useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const hydrate = async () => {
      await useAuthStore.persist.rehydrate();
      setIsHydrated(true);
    };
    hydrate();
  }, []);
  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
