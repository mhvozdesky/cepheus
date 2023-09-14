import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import axios from "axios";
import { format } from 'date-fns';
import PreLoader from "../components/UI/PreLoader"
import LabeledInput from "../components/UI/LabeledInput"
import LabeledSelect from "../components/UI/LabeledSelect"
import LabeledDate from "../components/UI/LabeledDate"
import OrderTableButton from "../components/UI/OrderTableButton"
import OrderFooterBtn from "../components/UI/OrderFooterBtn"
import ButtonDelete from "../components/UI/ButtonDelete"
import OrderInfoCustomer from "../components/OrderInfoCustomer"

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
        setOrder(prevOrder => ({
            ...prevOrder,
            [field]: value
        }));
    }

    const normalizeFloatValue = (value, type) => {
        const cleanedValue = value.replace(/\s+/g, '');
        const numberValue = parseFloat(cleanedValue);
        if (type == 'float') {
            return Number(numberValue.toFixed(2)) || 0;
        }

        return parseInt(numberValue, 10) || 0;
    };
    
    const changeTableFields = (index, field, value) => {
        const float_fields = ['price', 'amount'];
        const integer_fields = ['quantity'];

        var updatedValue = null;

        if (float_fields.includes(field)) {
            var rawNum = normalizeFloatValue(value, 'float')
            updatedValue = rawNum !== NaN ? rawNum : value
        } else if (integer_fields.includes(field)) {
            var rawNum = normalizeFloatValue(value, 'integer')
            updatedValue = rawNum !== NaN ? rawNum : value
        } else {
            updatedValue = value
        }
    
        setOrder(prevOrder => ({
            ...prevOrder,
            goods: prevOrder.goods.map((item, i) => {
                if (i !== index) return item;
                return { ...item, [field]: updatedValue };
            }),
        }));
    };
    

    const numberDisplay = (number, type) => {
        if (type == 'float') {
            return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }
        return number
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
                        type='text'
                        index={null}
                        value={order.id}
                        change={changeFields}
                        control_elem={false}
                        readOnly={true}
                    />
                    <LabeledInput
                        input_name='created_at'
                        label_text='Створено'
                        type='text'
                        index={null}
                        value={order.id ? format(new Date(order.created_at), datePattern) : ''}
                        change={changeFields}
                        control_elem={false}
                        readOnly={true}
                    />
                    <LabeledInput
                        input_name='modified_at'
                        label_text='Оновлено'
                        type='text'
                        index={null}
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
                        type='text'
                        index={null}
                        value={order.responsible_display}
                        change={changeFields}
                        control_elem={true}
                        readOnly={false}
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
                                        <LabeledInput
                                            input_name='good_title'
                                            label_text=''
                                            type='text'
                                            index={index}
                                            value={good.good_title}
                                            change={changeTableFields}
                                            control_elem={true}
                                            readOnly={true}
                                        />
                                    </td>
                                    <td className='vendor-code'>
                                        <LabeledInput
                                            input_name='vendor_code'
                                            label_text=''
                                            type='text'
                                            index={index}
                                            value={good.vendor_code}
                                            change={changeTableFields}
                                            control_elem={false}
                                            readOnly={true}
                                        />
                                    </td>
                                    <td className='price'>
                                        <LabeledInput
                                            input_name='price'
                                            label_text=''
                                            type='text'
                                            index={index}
                                            value={numberDisplay(good.price, 'float')}
                                            change={changeTableFields}
                                            control_elem={false}
                                            readOnly={false}
                                        />
                                    </td>
                                    <td className='quantity'>
                                        <LabeledInput
                                            input_name='quantity'
                                            label_text=''
                                            type='number'
                                            index={index}
                                            value={numberDisplay(good.quantity, 'integer')}
                                            change={changeTableFields}
                                            control_elem={false}
                                            readOnly={false}
                                        />
                                    </td>
                                    <td className='amount'>
                                        <LabeledInput
                                            input_name='amount'
                                            label_text=''
                                            type='text'
                                            index={index}
                                            value={numberDisplay(good.amount, 'float')}
                                            change={changeTableFields}
                                            control_elem={false}
                                            readOnly={true}
                                        />
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
                <div className='btn-block'>
                    <OrderTableButton 
                        name='add_good'
                        value='Додати товар'
                    />
                </div>
            </div>
            <div className='customer-info'>
                <OrderInfoCustomer 
                    customer_id={order.customer}
                    place_of_delivery={order.place_of_delivery}
                    customer_comment={order.customer_comment}
                />
            </div>
            <div className='footer-block'>
                <OrderFooterBtn
                    text='Зберегти'
                    name='save'
                />
                <OrderFooterBtn
                    text='Відмінити'
                    name='cancel'
                />
            </div>
        </div>
    );
};

export default OrderDetailPage;