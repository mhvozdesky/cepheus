import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContex} from "../contex/index";
import axios from "axios";

const Register = function() {
    const {isAuth, setIsAuth, isLoading, setLoadCustomer} = useContext(AuthContex)
    const [emailField, setEmailField] = useState({text: '', errors: []})
    const [passwordField, setPasswordField] = useState({text: '', errors: []})
    const [rePasswordField, setRePasswordField] = useState({text: '', errors: []})
    const [commonError, setCommonError] = useState({text: '', errors: []})

    const cleanErrors = () => {
        setEmailField(prevState => ({ ...prevState, errors: []}))
        setPasswordField(prevState => ({ ...prevState, errors: []}))
        setRePasswordField(prevState => ({ ...prevState, errors: []}))
        setCommonError(prevState => ({ ...prevState, errors: []}))
    }

    const register = (e) => {
        cleanErrors();
        const url = '/api/v1/accounts/register/';
        const data = {
            email: emailField.text,
            password: passwordField.text,
            re_password: rePasswordField.text
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
            setLoadCustomer(true)
        })
        .catch((error) => {
            if (typeof error.response.data.email != 'undefined') {
                setEmailField(prevState => ({ ...prevState, errors: error.response.data.email}))
            }
            if (typeof error.response.data.password != 'undefined') {
                setPasswordField(prevState => ({ ...prevState, errors: error.response.data.password}))
            }
            if (typeof error.response.data.re_password != 'undefined') {
                setRePasswordField(prevState => ({ ...prevState, errors: error.response.data.re_password}))
            }
            if (typeof error.response.data.non_field_errors != 'undefined') {
                setCommonError(prevState => ({ ...prevState, errors: error.response.data.non_field_errors}))
            }
            if (typeof error.response.data.detail != 'undefined') {
                console.log(error.response.data.detail)
                setCommonError(prevState => ({ ...prevState, errors: [error.response.data.detail]}))
            }
        })
    }

    return (
        <div className='login-page'>
            <p>Login Page</p>
            <label htmlFor='email'>Email</label>
            {emailField.errors &&
                <ul className='error-list'>
                    {emailField.errors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }
            <input onChange={e => setEmailField(prevState => ({ ...prevState, text: e.target.value}))} id='email' name='email' placeholder="Enter Email" type="email" required />
            <label htmlFor='password'>Password</label>
            {passwordField.errors &&
                <ul className='error-list'>
                    {passwordField.errors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }
            <input onChange={e => setPasswordField(prevState => ({ ...prevState, text: e.target.value}))} id='password' name='password' placeholder="Enter Password" type="password" required />
            <label htmlFor='re-password'>Re-Password</label>
            {rePasswordField.errors &&
                <ul className='error-list'>
                    {rePasswordField.errors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }
            <input onChange={e => setRePasswordField(prevState => ({ ...prevState, text: e.target.value}))} id='re-password' name='re-password' placeholder="Enter Re-Password" type="password" required />
            {commonError.errors &&
                <ul className='error-list'>
                    {commonError.errors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }
            <button onClick={register} type="button" className="auth-button">Register</button>
            <p>Already have an account? <Link to="/login">Sign up.</Link></p>
        </div>
    );
};

export default Register;