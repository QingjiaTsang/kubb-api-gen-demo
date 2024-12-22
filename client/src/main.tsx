import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import env from '@/env';

/* ********** Start MSW ********** */
import { worker } from './customMocks/browser.ts';

if (env.VITE_ENABLE_MSW === 'true' && process.env.NODE_ENV === 'development') {
  worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .catch(console.error);
}
/* ********** Start MSW ********** */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
