import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import './style.scss'

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
