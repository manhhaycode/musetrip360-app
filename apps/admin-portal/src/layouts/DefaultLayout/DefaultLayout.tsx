// import { useModalStore } from '@/store/componentStore';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import Footer from '../components/Footer';
import Header from '../components/Header';

// const Modal = lazy(() => import('@/components/Modal'));
// const PortalModal = lazy(() => import('@/components/Portal/PortalModal'));

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-h-screen">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
