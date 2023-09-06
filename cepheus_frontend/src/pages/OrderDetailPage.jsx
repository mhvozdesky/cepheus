import React, {useState} from "react";
import {useParams} from "react-router-dom"
import LabeledInput from "../components/UI/LabeledInput"

const OrderDetailPage = function() {
    const route_params = useParams();
    // Order detail page {route_params.id}

    const [someValue, setSomeValue] = useState(route_params.id) 

    return (
        <div className='order-detail-page'>
            <div className='common-info'>
                <div className='panel panel1'>
                    <LabeledInput
                        input_name='order_id'
                        label_text='Замовлення'
                        value={someValue}
                        change={setSomeValue}
                    />
                </div>
            </div>
            <div className='goods-info'></div>
            <div className='customer-info'></div>
            <div className='footer-block'></div>
        </div>
    );
};

export default OrderDetailPage;