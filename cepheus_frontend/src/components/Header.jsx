import React, {useContext} from "react";
import {AuthContex} from "../contex/index";
import axios from "axios";

const Header = function() {
    const {isAuth, setIsAuth, isLoading, setLoadCustomer, customer} = useContext(AuthContex)

    const logout = () => {
        const url = '/api/v1/accounts/logout/';

        const headers = {
            "Content-Type": "application/json"
        }

        if (document.cookie) {
            headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
        }

        axios.post(
            url,
            {},
            {
                withCredentials: true,
                headers: headers
            }
        )
        .then((response) => {
            setIsAuth(false)
        })
        .catch((error) => {
            console.log(error.response.data)
        })
    }


    return (
        <div className='header'>
            <div className='header-item logo'>
                <div className='logo-image'></div>
            </div>
            <div className='header-item company'>
                <div className='text'>CEPHEUS</div>
            </div>
            {isAuth &&
                <div className='header-item user'>
                    <div className='dropdown-wrapper'>
                        <div className='text'>{customer.first_name} {customer.last_name}</div>
                        <div className='header-profile-list'>
                            <div className='header-profile-list-item'>Мій профіль</div>
                            <div onClick={logout} className='header-profile-list-item'>Вийти</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Header;