import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CartProvider>
          <App />
        </CartProvider>
        </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)