import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useCookies } from "react-cookie";

function App() {
  const [count, setCount] = useState(0)
  const { getAccessTokenSilently } = useAuth0();
  const [cookies] = useCookies(["IdToken"]);

  useEffect(() => {
    testApiCall();
  }, []);

  const testApiCall = async () => {
    const token = await cookies["IdToken"];
    const accessToken = await getAccessTokenSilently();

    
    await fetch("https://localhost:7037/WeatherForecast", {method: "GET", headers: { Authorization: `Bearer ${token}`} })
    .then((rsp) => rsp.json())
    .then((obj) => { console.log('id token'); console.log(obj); })
    .catch((error) => {
      console.log(error)
    });

    await fetch("https://localhost:7037/WeatherForecast", {method: "GET", headers: { Authorization: `Bearer ${accessToken}`} })
    .then((rsp) => rsp.json())
    .then((obj) => { console.log('access token'); console.log(obj); })
    .catch((error) => {
      console.log(error)
    });
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
