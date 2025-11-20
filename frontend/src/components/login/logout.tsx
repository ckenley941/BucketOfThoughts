
import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
//import { useCookies  } from "react-cookie";

export function Logout() {    
  const { logout } = useAuth0();
  
    //const [cookies, removeCookie] = useCookies(["AccessToken"]);

    useEffect(() => {
        setTimeout(() => {
           // removeCookie("AccessToken");
        }, 200)
       ;
        logout({ logoutParams: { returnTo: window.location.origin } })

      }, []);

      return (<></>)
}
