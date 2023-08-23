import React, {useState, useEffect} from "react";
import './styles/App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter"
import Header from "./components/Header"
import SidePanel from "./components/SidePanel"
import PreLoader from "./components/UI/PreLoader"
import {AuthContex} from "./contex/index"
import axios from "axios"

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [loadCustomer, setLoadCustomer] = useState(false)

  const getCustomer = async () => {
    console.log('spam')
    setIsLoading(true)
    const url = 'api/v1/accounts/me/';

    const headers = {
      "Content-Type": "application/json"
    }

    if (document.cookie) {
      headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
    }

    await axios.get(
      url,
      {
          withCredentials: true,
          headers: headers
      }
    )
    .then((response) => {
      setCustomer(response.data)
      setIsAuth(true)
      setIsLoading(false)
    })
    .catch((error) => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    getCustomer();
  }, [])

  useEffect(() => {
    if (loadCustomer) {
      getCustomer();
    }
  }, [loadCustomer])

  if (isLoading) {
    return (
      <PreLoader />
    )
  }

  const appRouterComponent = (
    <div className="work-space">
      <AppRouter />
    </div>
  );

  return (
    <AuthContex.Provider value={{isAuth, setIsAuth, isLoading, setLoadCustomer}}>
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
