import React, {useState, useEffect} from "react";
import './styles/App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter"
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

  return (
    <AuthContex.Provider value={{isAuth, setIsAuth, isLoading}}>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </AuthContex.Provider>
  )
}

export default App;
