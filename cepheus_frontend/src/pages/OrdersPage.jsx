import React, {useState, useEffect} from "react";
import ButtonAdd from "../components/UI/ButtonAdd"
import ButtonExport from "../components/UI/ButtonExport"
import ButtonDelete from "../components/UI/ButtonDelete"
import SelectOption from "../components/UI/SelectOption"
import PreLoader from "../components/UI/PreLoader"
import OrdersTable from "../components/OrdersTable"
import axios from "axios";

const OrdersPage = function() {
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [orders, setOrders] = useState([])
    const [printOrders, setPrintOrders] = useState(false)

    const getOrders = () => {
        setLoadingOrders(true)
        const url = 'api/v1/orders/';

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
            setOrders(response.data['results'])
            setLoadingOrders(false)
            setPrintOrders(true)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingOrders(false)
        })
    }

    const printOrd = () => {
        if (printOrders) {
            console.log(orders)
        }
    }


    useEffect(() => {
        getOrders();
      }, [])

    // useEffect(() => {
    //     printOrd();
    //   }, [printOrders])

    if (loadingOrders) {
        return (
            <PreLoader />
        )
    }


    return (
        <div className='page order-page'>
            <div className='page-header'>
                <div className='header-part part0'>
                    <ButtonAdd />
                    <SelectOption
                        class_name='responsible'
                        defaultValue="Відповідальний"
                        options={[
                            {value: 1, name: "Антон Сурін"},
                            {value: 2, name: "Аліса Срібчук"}
                        ]}
                    />
                    <SelectOption
                        class_name='status'
                        defaultValue="Статус"
                        options={[
                            {value: 'in_progress', name: "В роботі"},
                            {value: 'canceled', name: "Анульовано"},
                            {value: 'returned', name: "Повернено"},
                            {value: 'shipped', name: "В дорозі"},
                            {value: 'shipped_back', name: "В дорозі назад"},
                            {value: 'completed', name: "Готово"},
                        ]}
                    />
                    <div className='wrapper-period'>
                        <div className='wrapper-date wrapper-date-start'>
                            <label htmlFor='date_start'>з</label>
                            <input type='date' name='date_start' lang='uk'/>
                        </div>
                        <div className='wrapper-date wrapper-date-end'>
                            <label htmlFor='date_end'>по</label>
                            <input type='date' name='date_end' lang='uk'/>
                        </div>
                        <SelectOption
                            class_name='date'
                            defaultValue="Період"
                            options={[
                                {value: 'today', name: "Сьогодні"},
                                {value: 'this_week', name: "Поточний тиждень"},
                                {value: 'this_month', name: "Поточний місяць"},
                                {value: 'own_option', name: "Свій варіант"}
                            ]}
                        />
                    </div>
                </div>
                <div className='header-part part1'>
                    <ButtonExport />
                    <ButtonDelete />
                </div>
            </div>
            <div className='page-content'>
                <div className='block-table'>
                    <OrdersTable orders={orders}/>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;