import React, {useState} from "react";
import {useParams} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import axios from "axios";

const ConfirmPassword = function() {
    const route_params = useParams();
    const router = useNavigate()

    const [passwordField, setPasswordField] = useState({text: '', errors: []})
    const [rePasswordField, setRePasswordField] = useState({text: '', errors: []})
    const [commonError, setCommonError] = useState({text: '', errors: []})

    const cleanErrors = () => {
        setPasswordField(prevState => ({ ...prevState, errors: []}))
        setRePasswordField(prevState => ({ ...prevState, errors: []}))
        setCommonError(prevState => ({ ...prevState, errors: []}))
    }

    const confirm_pass = (e) => {
        cleanErrors();
        const url = `/api/v1/reset-password/${route_params.user_id}/${route_params.token_obj}/`;
        const data = {
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
            router(`/login`)
        })
        .catch((error) => {
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
            <p>Confirm Page</p>
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
            <button onClick={confirm_pass} type="button" className="auth-button">Confirm</button>
        </div>
    );
};

export default ConfirmPassword;