import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/kalendar.css'
import './css/kartice.css'
import './css/header-footer.css'
import './css/prognoza.css'
import App from './App.jsx'

import { AuthProvider } from "./api/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
