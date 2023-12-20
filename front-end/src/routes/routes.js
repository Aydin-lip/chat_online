import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import ChatScreen from "../pages";

const PrivetRoute = ({ children }) => {
  const token = localStorage.getItem('nickname')
  return !token ? <Navigate to={'/login'} replace /> : children
}

const Routes = createBrowserRouter([
  {
    path: '/',
    element:
      <PrivetRoute>
        <ChatScreen />
      </PrivetRoute>
  }, {
    path: '/login',
    element: <Login />
  }
])

export default Routes