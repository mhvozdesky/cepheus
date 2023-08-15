import React from "react";

const Header = function() {
    return (
        <div className='header'>
            <div className='header-item logo'>
                <div className='logo-image'></div>
            </div>
            <div className='header-item company'>
                <div className='text'>CEPHEUS</div>
            </div>
            <div className='header-item user'>
                <div className='text'>Антон Сурін</div>
            </div>
        </div>
    );
};

export default Header;