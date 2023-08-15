import React, {useContext} from "react";
import {Route, Routes} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../router/index"
import {AuthContex} from "../contex/index"
import Loader from "./UI/Loader/Loader"

const AppRouter = function() {
    const {isAuth, setIsAuth, isLoading} = useContext(AuthContex)
    console.log(isAuth)

    if (isLoading) {
        return <Loader/>
    }

    return (
        <Routes>
            {isAuth
                ? (privateRoutes.map(route => 
                    <Route key={route.path} path={route.path} element={route.element} exact={route.exact}/>
                ))
                : (publicRoutes.map(route => 
                    <Route key={route.path} path={route.path} element={route.element} exact={route.exact}/>
                ))
            }
        </Routes> 
    );
};

export default AppRouter;