import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2800,
            style: {
              background: '#2f2a25',
              color: '#f6f1e4',
              borderRadius: '2px',
              fontSize: '14px',
              fontFamily: 'Manrope, sans-serif',
            },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
