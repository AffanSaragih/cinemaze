import '@/scss/globals.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchProvider } from './context/SearchContext';
import { MovieProvider } from '@/context/MovieContext';
import { ToastProvider } from '@/provider/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <SearchProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SearchProvider>
      </MovieProvider>
    </BrowserRouter>
  </React.StrictMode>
);
