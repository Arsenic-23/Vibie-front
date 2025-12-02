// src/main.jsx 

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';
import { Toaster } from 'react-hot-toast';
import { RealtimeProvider } from './context/RealtimeContext';   

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <ThemeProvider>
        <BrowserRouter>
          <RealtimeProvider>   {/* ✅ WRAP APP INSIDE THIS */}
            <Toaster position="top-center" reverseOrder={false} />
            <App />
          </RealtimeProvider>  {/* ✅ */}
        </BrowserRouter>
      </ThemeProvider>
    </UIProvider>
  </React.StrictMode>
);
