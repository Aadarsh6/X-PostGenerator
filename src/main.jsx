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
import { ComingSoon } from './Pages/ComingSoon'
import WelcomePage from './Pages/WelcomePage'
import WelcomeWrapper from './components/WelcomeWrapper'
import OAuthCallback from './Pages/OAuthCallback'
import { inject } from '@vercel/analytics';
 
inject();
const router = createBrowserRouter([
  {path: "/signIn", element: <App/>},
  {path: "/signup", element: <SignupPage/>},
  {path: "/login", element: <LogInPage/>},
  {path: "/save", element: <SavePage/>},
  {path: "/", element: <LandingPage/>},
  {path: "/contact", element: <ContactPage/>},
  // {path: "/welcome", element: <WelcomePage/>},   //!For Development
  {path: "/soon", element: <ComingSoon/>},
  {
  path: "/oauth/callback", // or whatever path you prefer
  element: <OAuthCallback />
},
  {
    path: "/dashboard", 
    element: (
      <ProtectRoute> 
        <WelcomeWrapper> 
          <DashboardPage/> 
        </WelcomeWrapper> 
      </ProtectRoute>
    )
  },
  // Add WelcomeWrapper to other protected routes that need it
  {
    path: "/save-post", 
    element: (
      <ProtectRoute> 
        <WelcomeWrapper> 
          <SavePostPage/> 
        </WelcomeWrapper> 
      </ProtectRoute>
    )
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