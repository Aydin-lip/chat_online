import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import './global.css'

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
}

export default App;
