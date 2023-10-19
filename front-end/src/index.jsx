import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'
import App from './App';
import Routes from './routes/routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={Routes}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);