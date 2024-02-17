import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App';
import Routes from './routes/routes';
import Store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <RouterProvider router={Routes}>
      <App />
    </RouterProvider>
  </Provider>
);