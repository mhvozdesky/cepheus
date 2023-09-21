import React from "react";

const OrderTableButton = function(props) {
    return (
        <div className={`table-btn ${props.name}`} onClick={props.handler}>
            <div className='text'>{props.value}</div>
        </div>
    );
};

export default OrderTableButton;