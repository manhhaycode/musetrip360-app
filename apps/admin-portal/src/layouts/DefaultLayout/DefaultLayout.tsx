// import { useModalStore } from '@/store/componentStore';
import { useIsAuthenticated } from '@musetrip360/auth-system';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import AppSidebar from '../components/Sidebar';

// const Modal = lazy(() => import('@/components/Modal'));
// const PortalModal = lazy(() => import('@/components/Portal/PortalModal'));

export default function DefaultLayout() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect to login if not authenticated - this is the protected route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex overflow-hidden bg-secondary/10 gap-0">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden gap-0">
          <Header />
          <main className="flex-1 overflow-auto border-none bg-secondary/20">
            <div className="w-full p-4">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
