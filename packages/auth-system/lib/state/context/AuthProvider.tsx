import { Fragment, useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useShallow } from 'zustand/shallow';

export const AuthProvider = ({ children, strictMode = true }: { children: React.ReactNode; strictMode?: boolean }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hydrate } = useAuthStore(useShallow((state) => ({ hydrate: state.hydrate })));
  useEffect(() => {
    hydrate().then(() => {
      setIsHydrated(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (strictMode) {
    return <Fragment>{isHydrated ? children : null}</Fragment>;
  }
  return children;
};
