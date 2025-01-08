import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function Login() {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    loginWithRedirect();
  }, []);
  

    return (
      <div className="flex min-h-screen w-full flex-wrap items-stretch justify-center">
        <div className="w-[inherit] max-w-[615px] p-8 items-stretch justify-center">
          <div className="mb-6 flex w-full items-center justify-center">
            {/* <Logo className="h-7 w-[207px]" /> */}
          </div>
        </div>
      </div>
    );
}