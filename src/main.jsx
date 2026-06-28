import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DashboardPage } from './Pages/DashboardPage'
import { LandingPage } from './Pages/LandingPage'
import ContactPage from './Pages/Contact'
import { ComingSoon } from './Pages/ComingSoon'
import { SignupPage } from './Pages/SignupPage'
import { LogInPage } from './Pages/LogInPage'
import ProtectRoute from './components/ProtectRoute'
import { inject } from '@vercel/analytics'
import { AvatarProvider } from './components/BlockComponent/Context/avatarContext'
import { SavePage } from './Pages/SavePage'
import ProfilePage from './Pages/profile'

inject();

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/soon", element: <ComingSoon /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LogInPage /> },
  {
  path: "/save",
  element: (
    <ProtectRoute>
      <SavePage />
    </ProtectRoute>
  )
},
  {
    path: "/dashboard",
    element: (
      <ProtectRoute>
        <DashboardPage />
      </ProtectRoute>
    )
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AvatarProvider>
    <RouterProvider router={router} />
    </AvatarProvider>
  </StrictMode>
)