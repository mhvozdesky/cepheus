import React from "react";

const CustomerTableRow = function(props) {
    return (
        <div className={`row row${props.index}`}>
            <div className='row-item checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </div>
            <div className='row-item id'>
                <div className='text'>{props.customer.id}</div>
            </div>
            <div className='row-item full-name'>
                <div className='text'>{`${props.customer.first_name} ${props.customer.last_name}`}</div>
            </div>
            <div className='row-item email'>
                <div className='text'>{props.customer.email}</div>
            </div>
            <div className='row-item phone'>
                <div className='text'>{props.customer.phone_number}</div>
            </div>
        </div>
    );
};

export default CustomerTableRow;