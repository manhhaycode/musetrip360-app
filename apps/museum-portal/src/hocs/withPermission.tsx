// create hoocs withPermission to check if user is authenticated or not and redirect to login page if not authenticated or expired token
import NotPermission from '@/features/exception/NotPermission';
import { useMuseumStore } from '@musetrip360/museum-management';
import { useRolebaseStore } from '@musetrip360/rolebase-management';

const withPermission = <P extends object>(WrappedComponent: React.ComponentType<P>, permissions: string[]) => {
  const Wrapper: React.FC<P> = (props) => {
    const { selectedMuseum } = useMuseumStore();
    const { hasAnyPermission } = useRolebaseStore();

    // Render the wrapped component if authenticated
    return hasAnyPermission(selectedMuseum?.id || 'system', permissions) && permissions.length > 0 ? (
      <WrappedComponent {...props} />
    ) : (
      <NotPermission />
    );
  };

  // Set the display name for the wrapped component for better debugging experience
  Wrapper.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default withPermission;
