// import { useModalStore } from '@/store/componentStore';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// const Modal = lazy(() => import('@/components/Modal'));
// const PortalModal = lazy(() => import('@/components/Portal/PortalModal'));

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex overflow-hidden bg-secondary/10 gap-0">
        <Sidebar />
        <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden gap-0">
          <Header />
          <main className="flex-1 overflow-auto border-none bg-secondary/20">
            <div className="w-full px-4 py-4">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
