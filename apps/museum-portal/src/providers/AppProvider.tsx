import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { AuthProvider } from '@musetrip360/auth-system';
import { UserProvider } from '@musetrip360/user-management';
import { MuseumProvider } from '@musetrip360/museum-management';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthProvider>
        <UserProvider>
          <MuseumProvider>{children}</MuseumProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
