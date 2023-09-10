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
    const [loadingOrder, setLoadingOrder] = useState(true)

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
            <div className='goods-info'>
                <div className='table-block'>
                    <table className='goods-table'>
                        <thead>
                            <tr>
                                <th scope='col' className='checkbox-column col1'>
                                    <div className='text'><span><input type='checkbox'/></span></div>
                                </th>
                                <th scope='col' className='id-good col2'>
                                    <div className='text'>ID Товару</div>
                                </th>
                                <th scope='col' className='good_title col1'>
                                    <div className='text'>Назва</div>
                                </th>
                                <th scope='col' className='vendor-code col2'>
                                    <div className='text'>Артикул</div>
                                </th>
                                <th scope='col' className='price col1'>
                                    <div className='text'>Ціна</div>
                                </th>
                                <th scope='col' className='quantity col2'>
                                    <div className='text'>Кількість</div>
                                </th>
                                <th scope='col' className='amount col1'>
                                    <div className='text'>Сума</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.goods.map((good, index) => 
                                <tr key={index} className={`row${index}`}>
                                    <td className='checkbox'>
                                        <div className='text'><span><input type='checkbox'/></span></div>
                                    </td>
                                    <td className='id-good'>
                                        <div className='text'>{good.good}</div>
                                    </td>
                                    <td className='good_title'>
                                        <div className='text'>{good.good_title}</div>
                                    </td>
                                    <td className='vendor-code'>
                                        <div className='text'>{good.vendor_code}</div>
                                    </td>
                                    <td className='price'>
                                        <div className='text'>{good.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
                                    </td>
                                    <td className='quantity'>
                                        <div className='text'>{good.quantity}</div>
                                    </td>
                                    <td className='amount'>
                                        <div className='text'>{good.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
                                    </td>
                                </tr>
                            )}
                            <tr className='total-row' id='order_goods_total_row'>
                                <td className='checkbox'>
                                    <div className='text'></div>
                                </td>
                                <td className='id-good'>
                                    <div className='text'>Всього</div>
                                </td>
                                <td className='good_title'>
                                    <div className='text'></div>
                                </td>
                                <td className='vendor-code'>
                                    <div className='text'></div>
                                </td>
                                <td className='price'>
                                    <div className='text'></div>
                                </td>
                                <td className='quantity'>
                                    <div className='text'></div>
                                </td>
                                <td className='amount'>
                                    <div className='text'>{order.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='btn-block'></div>
            </div>
            <div className='customer-info'></div>
            <div className='footer-block'></div>
        </div>
    );
};

export default OrderDetailPage;