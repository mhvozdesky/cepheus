import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import axios from "axios";
import { format } from 'date-fns';
import PreLoader from "../components/UI/PreLoader"
import LabeledInput from "../components/UI/LabeledInput"
import LabeledSelect from "../components/UI/LabeledSelect"
import OrderTableButton from "../components/UI/OrderTableButton"
import OrderFooterBtn from "../components/UI/OrderFooterBtn"
import ButtonDelete from "../components/UI/ButtonDelete"
import OrderInfoCustomer from "../components/OrderInfoCustomer"
import ModalOrders from "../components/ModalOrders"
import GoodsPage from "./GoodsPage"
import EmployeesList from "./EmployeesList"
import CustomersPage from "./CustomersPage"


const OrderDetailPage = function(props) {
    const route_params = useParams();
    // Order detail page {route_params.id}
    const datePattern = 'dd.MM.yyyy HH:mm'

    const [order, setOrder] = useState({})
    const [orderClear, setOrderClear] = useState({})
    const [loadingOrder, setLoadingOrder] = useState(true)
    const [modalOrdersVisible, setModalOrdersVisible] = useState(false)
    const [modalForm, setModalForm] = useState(null)
    const [good, setGood] = useState({data: null, index: null})
    const [updateTotalAmount, setUpdateTotalAmount] = useState(false)
    const [listSelectedProducts, setListSelectedProducts] = useState([])
    const [totalSelectedProducts, setTotalSelectedProducts] = useState(false)
    const [objectChanged, setObjectChanged] = useState(false)

    const importantFields = [
        'place_of_delivery',
        'responsible',
        'customer',
        'status',
        'payment_status',
        'customer_comment'
    ]

    const changeFields = (field, value) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            [field]: value
        }));
        setObjectChanged(true)
    }

    const normalizeFloatValue = (value, type) => {
        const cleanedValue = value.replace(/\s+/g, '');
        const numberValue = parseFloat(cleanedValue);
        if (type == 'float') {
            return Number(numberValue.toFixed(2)) || 0;
        }

        return parseInt(numberValue, 10) || 0;
    };

    const recalculateTotalAmount = () => {
        let newAmount = order.goods.reduce((acc, good) => acc + good.amount, 0);

        setOrder(prevOrder => ({
            ...prevOrder,
            amount: newAmount,
        }));
    }
    
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

        var amount = order.goods[index].amount

        if (field == 'price') {
            amount = updatedValue * order.goods[index].quantity
        } else if (field == 'quantity') {
            amount = updatedValue * order.goods[index].price
        } else if (field == 'amount') {
            amount = updatedValue
        }
    
        setOrder(prevOrder => ({
            ...prevOrder,
            goods: prevOrder.goods.map((item, i) => {
                if (i !== index) return item;
                return { ...item, [field]: updatedValue, ['amount']: Number(amount.toFixed(2)) };
            }),
        }));

        setUpdateTotalAmount(true)
        setObjectChanged(true)
    };

    const valueTotalSelectedProducts = () => {
        if (order.goods && listSelectedProducts.length == order.goods.length && order.goods.length > 0) {
            setTotalSelectedProducts(true)
        } else {
            setTotalSelectedProducts(false)
        }
    }

    const changeTotalSelectedProducts = () => {
        if (totalSelectedProducts) {
            setListSelectedProducts([])
        } else if (order.goods) {
            const arr = [];
            for (let i = 0; i < order.goods.length; i++) {
                arr.push(i);
            }
            setListSelectedProducts(arr)
        }
    }

    const changeListSelectedProducts = (index) => {
        if (listSelectedProducts.includes(index)) {
            setListSelectedProducts(prevList => prevList.filter(item => item !== index));
        } else {
            setListSelectedProducts(prevList => [...prevList, index]);
        }
    }

    const addGood = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            goods: prevOrder.goods.concat({
              quantity: 1,
              price: 0,
              amount: 0,
              good: null,
              good_title: '',
              vendor_code: ''
            })
        }));
        setUpdateTotalAmount(true);
        setObjectChanged(true);
    }

    const delGood = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            goods: prevOrder.goods.filter((item, index) => !listSelectedProducts.includes(index))
        }));
        setUpdateTotalAmount(true);
        setListSelectedProducts([])
        setObjectChanged(true);
    }

    const getGood = (id, index) => {
        const url = `/api/v1/goods/${id}/`;

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
            setGood({data: response.data, index: index})
        })
        .catch((error) => {
            console.log(error.response)
        })
    }

    const getResponsible = (responsibleID) => {
        const url = `/api/v1/accounts/${responsibleID}/`;

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
            setOrder(prevOrder => ({
                ...prevOrder,
                responsible: responsibleID, responsible_display: `${response.data.first_name} ${response.data.last_name}`
            }));
        })
        .catch((error) => {
            console.log(error.response)
        })
    }
    

    const numberDisplay = (number, type) => {
        if (type == 'float') {
            return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }
        return number
    }

    const fillNewGoodValue = (index, goodId) => {
        getGood(goodId, index)
    }

    const setNewResponsibleValue = (responsibleID) => {
        getResponsible(responsibleID)
    }

    const newModalValue = (index, valueId, field) => {
        if (field == 'good') {
            fillNewGoodValue(index, valueId)
        } else if (field == 'responsible') {
            setNewResponsibleValue(valueId)
        } else if (field == 'customer') {
            setOrder(prevOrder => ({
                ...prevOrder,
                customer: valueId
            }));
        }

        setModalOrdersVisible(false)
        setModalForm(null)
        setObjectChanged(true)
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
            setObjectChanged(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingOrder(false)
        })
    }

    const clearBadGoods = () => {
        setOrder(prevOrder => ({
            ...prevOrder,
            goods: prevOrder.goods.filter(item => item.good !== null)
        }));
    }

    const getUpdatedFields = () => {
        const updatedFields = {}

        for (let i in importantFields) {
            let field = importantFields[i]
            if (order[field] !== orderClear[field]) {
                updatedFields[field] = order[field]
            }
        }

        updatedFields['goods'] = order['goods']

        return updatedFields;
    }

    const sendData = (data) => {
        const url = `/api/v1/orders/${route_params.id}/`;

        const headers = {
            "Content-Type": "application/json"
        }

        if (document.cookie) {
            headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
        }

        axios.patch(
            url,
            data,
            {
                withCredentials: true,
                headers: headers
            }
        )
        .then((response) => {
            getOrder();
        })
        .catch((error) => {
            console.log(error.response.data)
        })
    }

    const saveOrder = () => {
        clearBadGoods();
        let updatedFields = getUpdatedFields();
        sendData(updatedFields);
    }

    const cancelOrder = () => {
        setOrder(orderClear)
        setObjectChanged(false)
    }

    const fetchAddData = () => {
        const data = {
            status: 'new',
            goods: [],
            payment_status: 'not_paid',
            place_of_delivery: '',
            customer_comment: '',
            responsible: null,
            customer: null,
            number: 0,
            amount: 0,
            status_display: '',
            payment_status_display: 'Не оплачено',
            responsible_display: '',
            latest_editor: '',
            created_at: "",
            modified_at: '',
            id: ''
        }

        return data
    }

    useEffect(() => {
        if (props.mode === 'edit') {
            getOrder();
        } else if (props.mode === 'add') {
            const data = fetchAddData();
            setOrder(data);
            setOrderClear(data);
            setLoadingOrder(false)
            setObjectChanged(false)
        }
    }, [])

    useEffect(() => {
        if (good.data) {
            changeTableFields(good.index, 'good', good.data.id)
            changeTableFields(good.index, 'good_title', good.data.title)
            changeTableFields(good.index, 'vendor_code', good.data.vendor_code)
            changeTableFields(good.index, 'price', good.data.price.toString())
            changeTableFields(good.index, 'quantity', '1')
            changeTableFields(good.index, 'amount', good.data.price.toString())
            setGood({data: null, index: null})
        }
    }, [good])

    useEffect(() => {
        if (order.goods && updateTotalAmount) {
            recalculateTotalAmount();
            setUpdateTotalAmount(false);
            valueTotalSelectedProducts();
        }
    }, [order])

    useEffect(() => {
        valueTotalSelectedProducts()
    }, [listSelectedProducts])

    if (loadingOrder) {
        return (
            <PreLoader />
        )
    }
    
    return (
        <div className='order-detail-page'>
            <ModalOrders 
                visible={modalOrdersVisible}
                setVisible={setModalOrdersVisible}
                content={modalForm}
            />
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
                            {value: 'new', name: "Новий"},
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
                        readOnly={true}
                        listInfo={
                            {
                                form: setModalOrdersVisible,
                                Component: <EmployeesList modalDirect={true} modalSelection={newModalValue} index={null} field='responsible' />,
                                setComponent: setModalForm
                            }
                        }
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
                                    <div className='text'><span><input
                                                                    type='checkbox'
                                                                    checked={totalSelectedProducts}
                                                                    onChange={() => changeTotalSelectedProducts()}
                                                                /></span></div>
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
                                        <div className='text'><span><input
                                                                        type='checkbox'
                                                                        checked={listSelectedProducts.includes(index)}
                                                                        onChange={() => changeListSelectedProducts(index)}
                                                                        />
                                                                    </span></div>
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
                                            listInfo={
                                                {
                                                    form: setModalOrdersVisible,
                                                    Component: <GoodsPage modalDirect={true} modalSelection={newModalValue} index={index} field='good' />,
                                                    setComponent: setModalForm
                                                }
                                            }
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
                        handler={addGood}
                    />
                    <OrderTableButton 
                        name='del_good'
                        value='Видалити товар'
                        handler={delGood}
                    />
                </div>
            </div>
            <div className='customer-info'>
                <OrderInfoCustomer 
                    customer_id={order.customer}
                    place_of_delivery={order.place_of_delivery}
                    customer_comment={order.customer_comment}
                    change={changeFields}
                    listInfo={
                        {
                            form: setModalOrdersVisible,
                            Component: <CustomersPage modalDirect={true} modalSelection={newModalValue} index={null} field='customer' />,
                            setComponent: setModalForm
                        }
                    }
                />
            </div>
            <div className='footer-block'>
                <div className='notes'>
                    <div className='text1'>{`Останній редактор: ${order.latest_editor}`}</div>
                </div>
                <div className='btn-block'>
                    <OrderFooterBtn
                        text='Зберегти'
                        name='save'
                        click={saveOrder}
                        active={objectChanged}
                    />
                    <OrderFooterBtn
                        text='Відмінити'
                        name='cancel'
                        click={cancelOrder}
                        active={objectChanged}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;