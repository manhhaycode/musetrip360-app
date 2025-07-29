import { Toaster } from '@musetrip360/ui-core';
import AppProvider from './providers/AppProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <Toaster position="top-right" duration={1000} />
    </AppProvider>
  );
}

export default App;
