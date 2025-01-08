import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function LoginCallback() {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    const [cookies, setCookie] = useCookies(["IdToken"]);
    const navigate = useNavigate();
    
    useEffect(() => {
        getToken();
        }, [isAuthenticated]);
      
    
      const getToken = async () => {
        if (!cookies["IdToken"]){
          if (isAuthenticated){
            const token = await getIdTokenClaims();
            console.log(token);
            
            var tomorrow = new Date();
            tomorrow.setDate(new Date().getDate()+1);
            setCookie("IdToken", token?.__raw, {
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