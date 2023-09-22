import React from "react";

const OrderFooterBtn = function(props) {
    let class_name = `order-footer-btn ${props.name}`

    if (!props.active) {
        class_name = class_name + ' ' + 'inactive'
    }

    const clickHandler = () => {
        if (!props.active) {
            return
        }

        props.click()
    }

    return (
        <div className={class_name} onClick={clickHandler}>
            <div className='text'>{props.text}</div>
        </div>
    );
};

export default OrderFooterBtn;