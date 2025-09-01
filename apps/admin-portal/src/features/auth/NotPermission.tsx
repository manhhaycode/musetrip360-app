import { useAuthStore } from '@musetrip360/auth-system';
import { getQueryClient } from '@musetrip360/query-foundation';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@musetrip360/ui-core';

const NotPermission = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You do not have permission to view this page. Please contact your administrator for access.
          </p>
          <Button
            className="w-full"
            onClick={() => {
              const queryClient = getQueryClient();
              queryClient.invalidateQueries({
                queryKey: ['users'],
              });
              useAuthStore.getState().resetStore();
              window.location.href = '/login';
            }}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotPermission;
