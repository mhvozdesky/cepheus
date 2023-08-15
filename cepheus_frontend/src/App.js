import React, {useState, useEffect} from "react";
import './styles/App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter"
import Header from "./components/Header"
import SidePanel from "./components/SidePanel"
import {AuthContex} from "./contex/index"

function App() {
  const [isAuth, setIsAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      setIsAuth(true)
    }
    setIsLoading(false)
  }, [])

  const appRouterComponent = (
    <div className="work-space">
      <AppRouter />
    </div>
  );

  return (
    <AuthContex.Provider value={{isAuth, setIsAuth, isLoading}}>
      <BrowserRouter>
          {isAuth ? (
            <>
              <Header />
              <div className='container'>
                  <SidePanel />
                  {appRouterComponent}
              </div>
            </>
          ) : (
            appRouterComponent
          )}
        </BrowserRouter>
    </AuthContex.Provider>
  )
}

export default App;
