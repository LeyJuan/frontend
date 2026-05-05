import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { configDotenv } from 'dotenv'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </UserProvider>
  </StrictMode>
)