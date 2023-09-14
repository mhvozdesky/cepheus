import React from "react";

const OrderTableButton = function(props) {
    return (
        <div className={`table-btn ${props.name}`}>
            <div className='text'>{props.value}</div>
        </div>
    );
};

export default OrderTableButton;