import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { BaseStyles } from '@primer/react';
import { ThemeProvider } from '@primer/react/next';
import { HelmetProvider } from 'react-helmet-async';

import '@primer/primitives/dist/css/functional/themes/light.css';
import '@primer/primitives/dist/css/base/motion/motion.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <BaseStyles>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BaseStyles>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>,
);
