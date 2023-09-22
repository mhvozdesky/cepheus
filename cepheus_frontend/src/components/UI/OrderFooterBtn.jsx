import React from "react";

const OrderFooterBtn = function(props) {
    return (
        <div className={`order-footer-btn ${props.name}`} onClick={props.click}>
            <div className='text'>{props.text}</div>
        </div>
    );
};

export default OrderFooterBtn;