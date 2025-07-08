import { useAuthModal } from '@/lib/state/hooks/useAuthModal';
import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { AuthModalConnector } from '@/lib/ui/components/AuthModalConnector';
import { Button } from '@musetrip360/ui-core/button';

const App = () => {
  const authModalControl = useAuthModal();
  return (
    <QueryClientProvider client={getQueryClient()}>
      <div className="flex flex-row gap-2 p-4">
        <Button onClick={() => authModalControl.open('login')}>Login</Button>
        <Button onClick={() => authModalControl.open('register')}>Register</Button>
        <Button onClick={() => authModalControl.open('forgot-password')}>Forgot Password</Button>
        <Button onClick={() => authModalControl.open('reset-password')}>Reset Password</Button>
      </div>
      <AuthModalConnector {...authModalControl} />
    </QueryClientProvider>
  );
};

export default App;
