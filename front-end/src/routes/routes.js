import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from '../components/Layout'
import Login from "../pages/login";

const PrivetRoute = ({ children }) => {
  const token = localStorage.getItem('nickname')
  return !token ? <Navigate to={'/login'} replace /> : children
}

const Routes = createBrowserRouter([
  {
    path: '/',
    element:
      <PrivetRoute>
        <Layout />
      </PrivetRoute>
  }, {
    path: '/login',
    element: <Login />
  }
])

export default Routes