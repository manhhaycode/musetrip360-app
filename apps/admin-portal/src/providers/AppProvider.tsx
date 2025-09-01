import { AuthProvider } from '@musetrip360/auth-system';
import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { UserProvider } from '@musetrip360/user-management';
import SuperAdminProvider from './SuperAdminProvider';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthProvider>
        <UserProvider>
          <SuperAdminProvider>{children}</SuperAdminProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
