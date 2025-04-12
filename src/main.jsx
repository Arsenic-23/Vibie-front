import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext'; // Import the UIProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider> {/* Wrap the app with the UIProvider to manage UI state */}
      <ThemeProvider> {/* Wrap the app with ThemeProvider for theme context */}
        <BrowserRouter> {/* Wrap the app with BrowserRouter for routing */}
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </UIProvider>
  </React.StrictMode>
);