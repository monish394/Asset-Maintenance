import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom"
import ScrollToTop from './scrooltotop.jsx'

// Fallback to a placeholder so the app doesn't crash when env var is missing.
// Set VITE_GOOGLE_CLIENT_ID in Render Dashboard > Environment (Build Env Vars)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-set-in-render";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,
)

