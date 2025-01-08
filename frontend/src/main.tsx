import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
 import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import { Login } from './components/login/login.tsx';
import { LoginCallback } from './components/login/login-callback.tsx';
import { Logout } from './components/login/logout.tsx';


const domain = "dev-1d3aiv64eevxng3r.us.auth0.com";
const clientId = "qyr9PM0Xn5BtRbPpu5sjTYpPheQmLGLj";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/login-callback",
    element: <LoginCallback/>,
  },
  {
    path: "/home",
    element: <App/>,
  },
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/logout",
    element: <Logout/>,
  }
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {domain && clientId ? 
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/login-callback",
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider> : <center className="p-10 font-bold">Auth0 Client not setup</center>}
  </StrictMode>,
)
