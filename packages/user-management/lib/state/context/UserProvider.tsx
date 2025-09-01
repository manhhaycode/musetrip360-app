import { userCacheKeys } from '@/api/cache/cacheKeys';
import { useCurrentProfile } from '@/api/hooks/useProfile';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';
import { getQueryClient } from '@musetrip360/query-foundation';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useShallow } from 'zustand/shallow';
import { useUserStore } from '../store/user.store';

export const UserProvider = ({ children, strictMode = true }: { children: React.ReactNode; strictMode?: boolean }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hydrate, setUser } = useUserStore(
    useShallow((state) => ({ hydrate: state.hydrate, setUser: state.setUser }))
  );
  const isAuthenticated = useIsAuthenticated();
  const { data: user, refetch } = useCurrentProfile({
    enabled: isHydrated && isAuthenticated,
  });

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
      getQueryClient().invalidateQueries({ queryKey: userCacheKeys.profile() });
    }
  }, [isHydrated, isAuthenticated, refetch]);

  if (strictMode) {
    return <Fragment>{isHydrated ? children : null}</Fragment>;
  }

  return children;
};
