import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { LoginForm } from './AuthUI/LoginForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <LoginForm/> */}
  </StrictMode>,
)
