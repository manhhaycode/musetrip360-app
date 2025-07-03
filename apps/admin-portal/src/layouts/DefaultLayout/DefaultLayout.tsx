// import { useModalStore } from '@/store/componentStore';
import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// const Modal = lazy(() => import('@/components/Modal'));
// const PortalModal = lazy(() => import('@/components/Portal/PortalModal'));

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex overflow-hidden" style={{ backgroundColor: '#fff0eb', gap: 0 }}>
        <Sidebar />
        <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden" style={{ gap: 0 }}>
          <Header />
          <main className="flex-1 overflow-auto" style={{ backgroundColor: '#fef7f0', border: 'none' }}>
            <div className="w-full px-4 py-4">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
