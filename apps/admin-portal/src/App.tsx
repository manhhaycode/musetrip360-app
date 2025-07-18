import AppProvider from '@/providers/AppProvider';
import AppRoutes from '@/routes';
import { ThemeProvider } from '@musetrip360/ui-core';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="musetrip360-admin-theme">
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
