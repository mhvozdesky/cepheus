import React, {useState} from "react";
import axios from "axios"

const LoginPage = function() {
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
        const url = 'api/v1/accounts/login/';
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
            console.log('1')
            console.log(response.data)
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
            {commonError.errors &&
                <ul className='error-list'>
                    {commonError.errors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
                </ul>
            }
            <button onClick={login} type="button" className="auth-button">Login</button>
        </div>
    );
};

export default LoginPage;