import { useCurrentProfile } from '@/api/hooks/useProfile';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useUserStore } from '../store/user.store';
import { IUser } from '@/types';
// import { getQueryClient } from '@musetrip360/query-foundation';
// import { userCacheKeys } from '@/api/cache/cacheKeys';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { data: user } = useCurrentProfile({
    enabled: isHydrated && isAuthenticated,
  });

  useEffect(() => {
    const hydrate = async () => {
      await useUserStore.persist.rehydrate();
      setIsHydrated(true);
    };
    hydrate();
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated && isHydrated) {
  //     getQueryClient().removeQueries({ queryKey: userCacheKeys.profile() });
  //     useUserStore.getState().resetStore();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      useUserStore.setState({ user: user as IUser });
    }
  }, [user]);

  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
