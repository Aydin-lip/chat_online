import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './style.scss'

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          theme="dark"
          closeOnClick
        />
      </Suspense>
    </>
  );
}

export default App;
