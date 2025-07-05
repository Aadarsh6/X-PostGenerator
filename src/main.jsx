import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignupPage } from './Pages/SignupPage.jsx'
import { LogInPage } from './Pages/LogInPage.jsx'
import { DashboardPage } from './Pages/DashboardPage.jsx'
import ProtectRoute from './AppWrite/ProtectRoute'
import { AuthProvider } from './AppWrite/AuthContext'
import { AvatarProvider } from './components/BlockComponent/Context/avatarContext'
import SavePostPage from './Pages/SavePostPage'
import { SavePage } from './Pages/SavePage'
import { LandingPage } from './Pages/LandingPage'
import ContactPage from './Pages/Contact'
import { CommingSoon } from './Pages/CommingSoon'

const router = createBrowserRouter([
  {path: "/signIn", element: <App/>},
  {path: "/signup", element: <SignupPage/>},
  {path: "/login", element: <LogInPage/>},
  {path: "/save", element: <SavePage/>},
  {path: "/", element: <LandingPage/>},
  {path: "/contact", element: <ContactPage/>},
  {path: "/soon", element: <CommingSoon/>},
  {path: "/dashboard", element: <ProtectRoute> <DashboardPage/> </ProtectRoute>
  }
])

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider>
      <AvatarProvider>
    <RouterProvider router={router} />
      </AvatarProvider>
    </AuthProvider>
  </StrictMode>,
)
