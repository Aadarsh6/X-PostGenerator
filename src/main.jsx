import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignupPage } from './Pages/SignupPage.jsx'
import { SigninPage } from './Pages/SignInPage.jsx'
import { DashboardPage } from './Pages/DashboardPage.jsx'


const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/signup", element: <SignupPage/>},
  {path: "/login", element: <SigninPage/>},
  {path: "/dashboard", element: <DashboardPage/>},
])

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
  </StrictMode>,
)
