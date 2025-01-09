//import { StrictMode } from 'react'
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
import env from './env.ts';


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

const auth0Config = {
  domain: env.auth0Domain,
  clientId: env.auth0ClientId,
  audience: env.auth0Audience
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <>
    {auth0Config.domain && auth0Config.clientId && auth0Config.audience ? 
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/login-callback",
        audience: auth0Config.audience
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider> : <center className="p-10 font-bold">Auth0 Client not setup</center>}
    </>
  //{/* </StrictMode> */}
)
