import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from "@auth0/auth0-react";
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <CartProvider>
          <App />
        </CartProvider>
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
)