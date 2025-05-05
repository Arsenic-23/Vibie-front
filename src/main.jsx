import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';
import { Toaster } from 'react-hot-toast'; // Import Toaster

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Add Toaster to display toast notifications globally */}
          <Toaster position="top-center" reverseOrder={false} />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </UIProvider>
  </React.StrictMode>
);