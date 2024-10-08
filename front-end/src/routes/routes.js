import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import ChatScreen from "../pages";
import SignIn from "../pages/login/signIn";
import SignUp from "../pages/login/signUp";
import Chat from "../components/chat";

const PrivetRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return !token ? <Navigate to={'/sign-in'} replace /> : children
}

const Routes = createBrowserRouter([
  {
    path: '/',
    element:
      <PrivetRoute>
        <ChatScreen />
      </PrivetRoute>,
    children: [
      { path: '/user/:id', element: <Chat /> },
      { path: '/group/:id', element: <Chat /> },
    ]
  }, {
    path: '/sign-in',
    element: <SignIn />
  }, {
    path: '/sign-up',
    element: <SignUp />
  }
])

export default Routes