import { useCurrentProfile } from '@/api/hooks/useProfile';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useUserStore } from '../store/user.store';
import { IUser } from '@/types';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';
import { useShallow } from 'zustand/shallow';
import { getQueryClient } from '@musetrip360/query-foundation';
import { userCacheKeys, UserCacheKeys } from '@/api/cache/cacheKeys';

export const UserProvider = ({ children, strictMode = true }: { children: React.ReactNode; strictMode: boolean }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hydrate, setUser } = useUserStore(
    useShallow((state) => ({ hydrate: state.hydrate, setUser: state.setUser }))
  );
  const isAuthenticated = useIsAuthenticated();
  const { data: user, refetch } = useCurrentProfile({
    enabled: isHydrated && isAuthenticated,
  });

  console.log(user);

  useEffect(() => {
    hydrate().then(() => {
      setIsHydrated(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      getQueryClient().invalidateQueries({ queryKey: userCacheKeys.profile() });
      refetch();
    }
    if (isHydrated && !isAuthenticated) {
      getQueryClient().removeQueries({ queryKey: userCacheKeys.profile() });
    }
  }, [isHydrated, isAuthenticated, refetch]);

  if (strictMode) {
    return <Fragment>{isHydrated ? children : null}</Fragment>;
  }

  return children;
};
