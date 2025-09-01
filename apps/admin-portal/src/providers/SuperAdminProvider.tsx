import NotPermission from '@/features/auth/NotPermission';
import { useAuthStore } from '@musetrip360/auth-system';
import { useIsSuperAdmin } from '@musetrip360/user-management';
import React, { useEffect } from 'react';

const SuperAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuthStore();

  const { data, refetch } = useIsSuperAdmin();

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [refetch, userId]);

  if (data === false) {
    return <NotPermission />;
  }

  return <>{children}</>;
};

export default SuperAdminProvider;
