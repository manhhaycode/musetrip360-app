import { Fragment, useEffect, useState } from 'react';
import { useMuseumStore } from '../store/museum.store';
import { useGetUserMuseums } from '@/api/hooks/useMuseum';

export const MuseumProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const hydrate = async () => {
      await useMuseumStore.getState().hydrate();
      setIsHydrated(true);
    };
    hydrate();
  }, []);
  const { data: userMuseums } = useGetUserMuseums();
  useEffect(() => {
    if (userMuseums && userMuseums.length > 0) {
      useMuseumStore.getState().setUserMuseums(userMuseums);
      useMuseumStore.getState().setSelectedMuseum(userMuseums[0] || null);
    }
  }, [userMuseums]);
  console.log(userMuseums);

  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
