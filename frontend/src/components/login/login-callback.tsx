import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function LoginCallback() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [cookies, setCookie] = useCookies(["AccessToken"]);
    const navigate = useNavigate();
    
    useEffect(() => {
        getToken();
        }, [isAuthenticated]);
      
    
      const getToken = async () => {
        if (!cookies["AccessToken"]){
          if (isAuthenticated){            
            const accessToken = await getAccessTokenSilently();
            
            var tomorrow = new Date();
            tomorrow.setDate(new Date().getDate()+1);
             setCookie("AccessToken", accessToken, {
              expires: tomorrow 
           })
            navigate("/home");
          }
        }else{
            navigate("/home");
        }
    }
  
    return (
      <div>
      </div>
    );
}