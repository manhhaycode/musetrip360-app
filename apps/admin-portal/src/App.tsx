import AppRoutes from '@/routes';
import { ThemeProvider } from '@musetrip360/ui-core';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="musetrip360-admin-theme">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
