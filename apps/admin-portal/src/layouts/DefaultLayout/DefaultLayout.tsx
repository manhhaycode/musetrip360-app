import { useIsAuthenticated } from '@musetrip360/auth-system';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core/sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/Sidebar';

export default function DefaultLayout() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return (
    <SidebarProvider>
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
