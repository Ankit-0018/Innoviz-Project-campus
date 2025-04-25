import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import { ProfileProvider } from './context/ProfileContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>

    <AuthProvider>
      <Toaster/>
  <App />
</AuthProvider>
    </ProfileProvider>
  </StrictMode>,
)
