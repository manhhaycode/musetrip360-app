import { Fragment, useEffect, useState } from 'react';
import { useRolebaseStore } from '../store/rolebase.store';
import { useGetUserPrivileges } from '@/api/hooks/useRolebase';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';

export const RolebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const { data: userPrivileges } = useGetUserPrivileges({
    enabled: isAuthenticated && isHydrated,
  });

  useEffect(() => {
    const hydrate = async () => {
      await useRolebaseStore.getState().hydrate();
      setIsHydrated(true);
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (userPrivileges) {
      useRolebaseStore.getState().setUserPrivileges(userPrivileges);
    }
  }, [userPrivileges]);

  return <Fragment>{isHydrated ? children : null}</Fragment>;
};
