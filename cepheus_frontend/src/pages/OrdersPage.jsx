import React from "react";
import ButtonAdd from "../components/UI/ButtonAdd"

const OrdersPage = function() {
    return (
        <div className='page order-page'>
            <div className='page-header'>
                <ButtonAdd />
            </div>
            <div className='page-content'></div>
        </div>
    );
};

export default OrdersPage;