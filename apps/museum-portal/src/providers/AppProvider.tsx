import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { AuthProvider } from '@musetrip360/auth-system';
import { UserProvider } from '@musetrip360/user-management';
import { MuseumProvider } from '@musetrip360/museum-management';
import { RolebaseProvider } from '@musetrip360/rolebase-management';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthProvider>
        <UserProvider>
          <MuseumProvider>
            <RolebaseProvider>{children}</RolebaseProvider>
          </MuseumProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
