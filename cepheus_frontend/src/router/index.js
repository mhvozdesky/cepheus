import {Navigate} from "react-router-dom";
import OrdersPage from "../pages/OrdersPage"
import OrderDetailPage from "../pages/OrderDetailPage"
import Page404 from "../pages/Page404"
import Login from "../pages/LoginPage"
import ConfirmPassword from "../pages/ConfirmPassword"
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"
import GoodsPage from "../pages/GoodsPage"
import EmployeesList from "../pages/EmployeesList"
import CustomersPage from "../pages/CustomersPage"
import CategoriesPage from "../pages/CategoriesPage"

export const privateRoutes = [
    {path: '/orders', element: <OrdersPage/>, exact: true},
    {path: '/orders/:id', element: <OrderDetailPage mode='edit' />, exact: true},
    {path: '/orders/add', element: <OrderDetailPage mode='add' />, exact: true},
    {path: '/goods', element: <GoodsPage/>, exact: true},
    {path: '/employees', element: <EmployeesList/>, exact: true},
    {path: '/customers', element: <CustomersPage/>, exact: true},
    {path: '/categories', element: <CategoriesPage/>, exact: true},
    {path: '/page404', element: <Page404/>, exact: true},
    {path: '/login', element: <Navigate to="/orders" replace />, exact: true},
    {path: '/register', element: <Navigate to="/orders" replace />, exact: true},
    // {path: '/', element: <Main/>, exact: true},
    {path: '*', element: <Navigate to="/page404" replace />, exact: true}
    
]

export const publicRoutes = [
    {path: '/login', element: <Login/>, exact: true},
    {path: '/register', element: <Register/>, exact: true},
    {path: '/forgot-password', element: <ForgotPassword/>, exact: true},
    {path: '/confirm-password/:user_id/:token_obj', element: <ConfirmPassword/>, exact: true},
    {path: '*', element: <Navigate to="/login" replace />, exact: true}
]