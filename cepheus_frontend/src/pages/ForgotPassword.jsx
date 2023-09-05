import React, {useState, useContext} from "react";
import Header from "../components/Header"
import AuthLogo from "../components/UI/AuthLogo"
import axios from "axios";

const ForgotPassword = function() {
    const [emailField, setEmailField] = useState({text: '', errors: []})
    const [commonError, setCommonError] = useState({text: '', errors: []})
    const [textForCustomer, setTextForCustomer] = useState('')

    const cleanErrors = () => {
        setEmailField(prevState => ({ ...prevState, errors: []}))
        setTextForCustomer('')
    }

    const forgot = (e) => {
        cleanErrors();
        const url = '/api/v1/accounts/reset-password/';
        const data = {
            email: emailField.text
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
            setTextForCustomer(response.data.detail)
        })
        .catch((error) => {
            if (typeof error.response.data.email != 'undefined') {
                setEmailField(prevState => ({ ...prevState, errors: error.response.data.email}))
            }
            if (typeof error.response.data.non_field_errors != 'undefined') {
                setCommonError(prevState => ({ ...prevState, errors: error.response.data.non_field_errors}))
            }
            if (typeof error.response.data.detail != 'undefined') {
                setCommonError(prevState => ({ ...prevState, errors: [error.response.data.detail]}))
            }
        })
    }

    return (
        <div className='auth-page forgot-page'>
            <Header />
            <div className='content'>
                <div className='auth-block'>
                    <AuthLogo />
                    <p className='title'>Forgot your password?</p>
                    {textForCustomer !== '' ?
                        <div className='text'>{textForCustomer}</div>
                        :
                        <>
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
                            {commonError.errors &&
                                <ul className='error-list'>
                                    {commonError.errors.map((error, index) => 
                                        <li key={index}>{error}</li>
                                    )}
                                </ul>
                            }
                            <button onClick={forgot} type="button" className="auth-button">Reset password</button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;