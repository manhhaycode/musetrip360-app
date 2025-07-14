import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { AuthProvider, useIsAuthenticated } from '@musetrip360/auth-system';
import { UserProvider } from '@musetrip360/user-management';
import { MuseumProvider } from '@musetrip360/museum-management';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthProvider>
        <UserProvider isAuthenticated={isAuthenticated}>
          <MuseumProvider>{children}</MuseumProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
