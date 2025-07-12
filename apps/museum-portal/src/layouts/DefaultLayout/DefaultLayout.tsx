import { SidebarInset, SidebarProvider } from '@musetrip360/ui-core/sidebar';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import DashboardSidebar from '../components/Sidebar';

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
