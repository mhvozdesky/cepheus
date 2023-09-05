import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContex} from "../contex/index";
import axios from "axios";
import Header from "../components/Header"
import AuthLogo from "../components/UI/AuthLogo"


const LoginPage = function() {
    const {isAuth, setIsAuth, isLoading, setLoadCustomer} = useContext(AuthContex)
    const [emailField, setEmailField] = useState({text: '', errors: []})
    const [passwordField, setPasswordField] = useState({text: '', errors: []})
    const [commonError, setCommonError] = useState({text: '', errors: []})

    const cleanErrors = () => {
        setEmailField(prevState => ({ ...prevState, errors: []}))
        setPasswordField(prevState => ({ ...prevState, errors: []}))
        setCommonError(prevState => ({ ...prevState, errors: []}))
    }

    const login = (e) => {
        cleanErrors();
        const url = '/api/v1/accounts/login/';
        const data = {
            email: emailField.text,
            password: passwordField.text
        }

        const headers = {
            "Content-Type": "application/json"
        }

        if (document.cookie) {
            headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
        }

        axios.post(
            url,
            data,
            {
                withCredentials: true,
                headers: headers
            }
        )
        .then((response) => {
            // setIsAuth(true)
            setLoadCustomer(true)
        })
        .catch((error) => {
            if (typeof error.response.data.email != 'undefined') {
                setEmailField(prevState => ({ ...prevState, errors: error.response.data.email}))
            }
            if (typeof error.response.data.password != 'undefined') {
                setPasswordField(prevState => ({ ...prevState, errors: error.response.data.password}))
            }
            if (typeof error.response.data.non_field_errors != 'undefined') {
                setCommonError(prevState => ({ ...prevState, errors: error.response.data.non_field_errors}))
            }
            if (typeof error.response.data.detail != 'undefined') {
                console.log(error.response.data.detail)
            }
        })
    }

    return (
        <div className='auth-page login-page'>
            <Header />
            <div className='content'>
                <div className='auth-block'>
                    <AuthLogo />
                    <p className='title'>Welcome to CEPHEUS</p>
                    {emailField.errors &&
                        <ul className='error-list'>
                            {emailField.errors.map((error, index) => 
                                <li key={index}>{error}</li>
                            )}
                        </ul>
                    }
                    <input
                        onChange={e => setEmailField(prevState => ({ ...prevState, text: e.target.value}))}
                        id='email'
                        name='email'
                        placeholder="Email"
                        type="email"
                        required
                    />
                    {passwordField.errors &&
                        <ul className='error-list'>
                            {passwordField.errors.map((error, index) => 
                                <li key={index}>{error}</li>
                            )}
                        </ul>
                    }
                    <input
                        onChange={e => setPasswordField(prevState => ({ ...prevState, text: e.target.value}))}
                        id='password'
                        name='password'
                        placeholder="Password"
                        type="password"
                        required
                    />
                    {commonError.errors &&
                        <ul className='error-list'>
                            {commonError.errors.map((error, index) => 
                                <li key={index}>{error}</li>
                            )}
                        </ul>
                    }
                    <button onClick={login} type="button" className="auth-button">Login</button>
                    <div className='info'>
                        <div className='forgot'>
                            <Link to="/forgot-password">Forgot password</Link>
                        </div>
                        <div className='create'>
                            <Link to="/register">Create account</Link>
                        </div>
                    </div>
                    {/* <p>Don't have an account yet? <Link to="/register">Sign up.</Link></p> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;