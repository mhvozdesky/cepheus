import {Navigate} from "react-router-dom";
import OrdersPage from "../pages/OrdersPage"
import Page404 from "../pages/Page404"
import Login from "../pages/LoginPage"
import Register from "../pages/Register"

export const privateRoutes = [
    {path: '/orders', element: <OrdersPage/>, exact: true},
    {path: '/page404', element: <Page404/>, exact: true},
    {path: '/login', element: <Navigate to="/orders" replace />, exact: true},
    {path: '/register', element: <Navigate to="/orders" replace />, exact: true},
    // {path: '/', element: <Main/>, exact: true},
    {path: '*', element: <Navigate to="/page404" replace />, exact: true}
    
]

export const publicRoutes = [
    {path: '/login', element: <Login/>, exact: true},
    {path: '/register', element: <Register/>, exact: true},
    {path: '*', element: <Navigate to="/login" replace />, exact: true}
]