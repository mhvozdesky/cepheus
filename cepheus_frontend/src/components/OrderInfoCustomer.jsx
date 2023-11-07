import React, {useState, useEffect} from "react";
import axios from "axios";
import PreLoader from "./UI/PreLoader"
import LabeledInput from "./UI/LabeledInput"
import LabeledText from "./UI/LabeledText"
import {get_blanck_customer} from "../utils"

const OrderInfoCustomer = function(props) {
    const [loadingCustomer, setLoadingCustomer] = useState(true)
    const [customer, setCustomer] = useState(true)

    const changeCustomer = () => {
        //
    }

    const changeHandler = (e) => {      
        props.change(e.target.id, e.target.value)
    }

    const getCustomer = () => {
        setLoadingCustomer(true)
        const url = `/api/v1/customers/${props.customer_id}/`;

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
            setCustomer(response.data)
            setLoadingCustomer(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingCustomer(false)
        })
    }

    useEffect(() => {
        //getCustomer();
    }, [])

    useEffect(() => {
        if (props.customer_id) {
            getCustomer();
        } else {
            const data = get_blanck_customer();
            setCustomer(data)
            setLoadingCustomer(false)
        }
    }, [props.customer_id])

    if (loadingCustomer) {
        return (
            <PreLoader id='order_customer_spinner' />
        )
    }

    return (
        <div className='order-info-customer'>
            <div className='local-header'>
                <div className='text'>Інформація про замовника</div>
            </div>
            <div className='local-content'>
                <div className='row1'>
                <LabeledInput
                    input_name='customer'
                    label_text='Замовник'
                    type='text'
                    index={null}
                    value={`${customer.first_name} ${customer.last_name}`}
                    change={changeCustomer}
                    control_elem={true}
                    readOnly={true}
                    listInfo={props.listInfo}
                />
                <LabeledInput
                    input_name='phone_number'
                    label_text='Телефон'
                    type='text'
                    index={null}
                    value={customer.phone_number}
                    change={changeCustomer}
                    control_elem={false}
                    readOnly={true}
                />
                <LabeledInput
                    input_name='email'
                    label_text='Email'
                    type='text'
                    index={null}
                    value={customer.email}
                    change={changeCustomer}
                    control_elem={false}
                    readOnly={true}
                />
                </div>
                <div className='row2'>
                    <LabeledText 
                        name='place_of_delivery'
                        label_text='Доставка'
                        value={props.place_of_delivery}
                        readOnly={false}
                        rows='15'
                        change={props.change}
                    />
                    <LabeledText 
                        name='customer_comment'
                        label_text='Коментар до замовлення'
                        value={props.customer_comment}
                        readOnly={false}
                        rows='15'
                        change={props.change}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderInfoCustomer;