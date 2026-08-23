import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import '@primer/primitives/dist/css/functional/themes/light.css';
import { BaseStyles } from '@primer/react';
import { ThemeProvider } from '@primer/react/next';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
);
