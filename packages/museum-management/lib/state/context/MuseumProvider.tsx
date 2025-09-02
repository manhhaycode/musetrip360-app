import { Fragment, useEffect, useState } from 'react';
import { useMuseumStore } from '../store/museum.store';
import { useGetUserMuseums } from '@/api/hooks/useMuseum';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';
import { useShallow } from 'zustand/shallow';
export const MuseumProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hydrate: hyDrateStore, setUserMuseums } = useMuseumStore(
    useShallow((state) => ({
      hydrate: state.hydrate,
      setUserMuseums: state.setUserMuseums,
    }))
  );
  const isAuthenticated = useIsAuthenticated();
  const { data: userMuseums } = useGetUserMuseums({
    enabled: isAuthenticated && isHydrated,
  });

  useEffect(() => {
    const hydrate = async () => {
      await hyDrateStore();
      setIsHydrated(true);
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userMuseums && userMuseums.length > 0 && isHydrated) {
      setUserMuseums(userMuseums);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userMuseums, isHydrated]);

  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
