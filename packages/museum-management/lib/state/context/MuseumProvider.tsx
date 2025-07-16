import { Fragment, useEffect, useState } from 'react';
import { useMuseumStore } from '../store/museum.store';
import { useGetUserMuseums } from '@/api/hooks/useMuseum';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';

export const MuseumProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { data: userMuseums } = useGetUserMuseums({
    enabled: isAuthenticated && isHydrated,
  });

  useEffect(() => {
    const hydrate = async () => {
      await useMuseumStore.getState().hydrate();
      setIsHydrated(true);
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (userMuseums && userMuseums.length > 0) {
      useMuseumStore.getState().setUserMuseums(userMuseums);
      useMuseumStore.getState().setSelectedMuseum(userMuseums[0] || null);
    }
  }, [userMuseums]);

  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
