import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'

import MyIssues from './pages/MyIssues'
import Issues from './pages/Issues'
import Profile from './pages/Profile'
import Lost_Found from './pages/Lost_Found'
import Register from './pages/Register'






const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path : '/register',
    element : <Register/>
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
        
      },
      {
        path: '/myIssues',
        element: <MyIssues/>
      }
      ,
      {
        path: '/issues',
        element: <Issues/>
      }
      ,
      {
        path: '/profile',
        element: <Profile/>
      }
      ,
      {
        path: '/lost&found',
        element: <Lost_Found/>
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
