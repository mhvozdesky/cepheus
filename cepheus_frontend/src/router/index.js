import {Navigate} from "react-router-dom";
import OrdersPage from "../pages/OrdersPage"
import OrderDetailPage from "../pages/OrderDetailPage"
import Page404 from "../pages/Page404"
import Login from "../pages/LoginPage"
import ConfirmPassword from "../pages/ConfirmPassword"
import Register from "../pages/Register"

export const privateRoutes = [
    {path: '/orders', element: <OrdersPage/>, exact: true},
    {path: '/orders/:id', element: <OrderDetailPage/>, exact: true},
    {path: '/page404', element: <Page404/>, exact: true},
    {path: '/login', element: <Navigate to="/orders" replace />, exact: true},
    {path: '/register', element: <Navigate to="/orders" replace />, exact: true},
    // {path: '/', element: <Main/>, exact: true},
    {path: '*', element: <Navigate to="/page404" replace />, exact: true}
    
]

export const publicRoutes = [
    {path: '/login', element: <Login/>, exact: true},
    {path: '/register', element: <Register/>, exact: true},
    {path: '/confirm-password/:user_id/:token_obj', element: <ConfirmPassword/>, exact: true},
    {path: '*', element: <Navigate to="/login" replace />, exact: true}
]