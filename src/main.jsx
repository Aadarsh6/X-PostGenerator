import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignupPage } from './Pages/SignupPage.jsx'
import { SigninPage } from './Pages/SignInPage.jsx'
import { DashboardPage } from './Pages/DashboardPage.jsx'
import ProtectRoute from './AppWrite/ProtectRoute'
import { AuthProvider } from './AppWrite/AuthContext'
import { AvatarProvider } from './components/BlockComponent/Context/avatarContext'
import SavePostPage from './Pages/SavePostPage'
import { SavePage } from './Pages/SavePage'

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/signup", element: <SignupPage/>},
  {path: "/login", element: <SigninPage/>},
  {path: "/save", element: <SavePage/>},
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
