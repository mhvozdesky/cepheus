import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import axios from "axios";
import { format } from 'date-fns';
import PreLoader from "../components/UI/PreLoader"
import LabeledInput from "../components/UI/LabeledInput"
import LabeledSelect from "../components/UI/LabeledSelect"
import LabeledDate from "../components/UI/LabeledDate"
import ButtonDelete from "../components/UI/ButtonDelete"

const OrderDetailPage = function() {
    const route_params = useParams();
    // Order detail page {route_params.id}
    const datePattern = 'dd.MM.yyyy HH:mm'

    const [someValue, setSomeValue] = useState(route_params.id)
    const [order, setOrder] = useState({})
    const [orderClear, setOrderClear] = useState({})
    const [loadingOrder, setLoadingOrder] = useState(false)

    // function getUpdatedFields(original, updated) {
    //     const changes = {};
        
    //     for (const key in original) {
    //         if (original[key] !== updated[key]) {
    //         changes[key] = updated[key];
    //         }
    //     }
        
    //     return changes;
    // }

    const changeFields = (field, value) => {
        console.log(field)
        console.log(value)
        setOrder(prevOrder => ({
            ...prevOrder,
            [field]: value
        }));
    }

    const getOrder = () => {
        setLoadingOrder(true)
        const url = `/api/v1/orders/${route_params.id}/`;

        const headers = {
            "Content-Type": "application/json"
        }

        if (document.cookie) {
            headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
        }

        axios.get(
            url,
            {
                withCredentials: true,
                headers: headers
            }
        )
        .then((response) => {
            setOrder(response.data)
            setOrderClear(response.data)
            setLoadingOrder(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingOrder(false)
        })
    }

    // useEffect(() => {
    //     if (order){
    //         console.log(order)
    //         console.log(orderClear)
    //     }
    // }, [order])

    useEffect(() => {
        getOrder();
    }, [])

    if (loadingOrder) {
        return (
            <PreLoader />
        )
    }
    
    return (
        <div className='order-detail-page'>
            <div className='common-info'>
                <div className='panel panel1'>
                    <LabeledInput
                        input_name='id'
                        label_text='Замовлення'
                        value={order.id}
                        change={changeFields}
                        control_elem={false}
                        readOnly={true}
                    />
                    <LabeledInput
                        input_name='created_at'
                        label_text='Створено'
                        value={order.id ? format(new Date(order.created_at), datePattern) : ''}
                        change={changeFields}
                        control_elem={false}
                        readOnly={true}
                    />
                    <LabeledInput
                        input_name='modified_at'
                        label_text='Оновлено'
                        value={order.id ? format(new Date(order.modified_at), datePattern) : ''}
                        change={changeFields}
                        control_elem={false}
                        readOnly={true}
                    />
                    <LabeledSelect
                        name='status'
                        label_text='Статус'
                        value={order.status}
                        change={changeFields}
                        options={[
                            {value: 'in_progress', name: "В роботі"},
                            {value: 'canceled', name: "Анульовано"},
                            {value: 'returned', name: "Повернено"},
                            {value: 'shipped', name: "В дорозі"},
                            {value: 'shipped_back', name: "В дорозі назад"},
                            {value: 'completed', name: "Готово"},
                        ]}
                    />
                    <LabeledSelect
                        name='payment_status'
                        label_text='Статус оплати'
                        value={order.payment_status}
                        change={changeFields}
                        options={[
                            {value: 'not_paid', name: "Не оплачено"},
                            {value: 'partially_paid', name: "Частково оплачено"},
                            {value: 'paid', name: "Оплачено"},
                            {value: 'overpaid', name: "Переплачено"}
                        ]}
                    />
                    <LabeledInput
                        input_name='responsible_display'
                        label_text='Відповідальний'
                        value={order.responsible_display}
                        change={changeFields}
                        control_elem={true}
                        readOnly={true}
                    />
                    <div className='btn-set'>
                        <ButtonDelete />
                    </div>
                </div>
            </div>
            <div className='goods-info'></div>
            <div className='customer-info'></div>
            <div className='footer-block'></div>
        </div>
    );
};

export default OrderDetailPage;