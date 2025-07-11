import ScrollToTop from '@/components/ScrollToTop';
import { Routes, Route, Navigate } from 'react-router';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" index element={<Navigate to={'/login'} />}></Route>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" index element={<div>Home</div>}></Route>
        </Route>
        <Route path="*" element={<div>404</div>}></Route>
      </Routes>
    </>
  );
}
