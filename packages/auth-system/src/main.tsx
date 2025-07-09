import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initEnv } from '@musetrip360/infras';
import { initAuthEndpoints } from '../lib/api/endpoints';

initEnv(import.meta.env, 'vite');
initAuthEndpoints();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
