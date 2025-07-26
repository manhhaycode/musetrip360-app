import { createRoot } from 'react-dom/client';
import App from './App';
import { initConfigApp } from './config';
import './index.css';

initConfigApp();

createRoot(document.getElementById('root')!).render(<App />);
