import React from "react";
import {useNavigate} from "react-router-dom"
import { format } from 'date-fns';

const OrdersTableRow = function(props) {
    const router = useNavigate()

    const formattedCreatedAt = format(new Date(props.order.created_at), 'dd.MM.yyyy HH:mm');
    const formattedModifiedAt = format(new Date(props.order.modified_at), 'dd.MM.yyyy HH:mm');

    return (
        <tr className={'row'+props.index} onDoubleClick={() => props.setOrderSelected(props.order.id)}>
            <td className='checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </td>
            <td className='id-order'>
                <div className='text'>{props.order.id}</div>
            </td>
            <td className='date-creation'>
                <div className='text'>{formattedCreatedAt}</div>
            </td>
            <td className='update-date'>
                <div className='text'>{formattedModifiedAt}</div>
            </td>
            <td className='status-order'>
                <div className='text'>{props.order.status_display}</div>
            </td>
            <td className='responsible'>
                <div className='text'>{props.order.responsible_display}</div>
            </td>
            <td className='number'>
                <div className='text'>{props.order.number}</div>
            </td>
            <td className='amount'>
                <div className='text'><div className='text'>{props.order.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div></div>
            </td>
            <td className='payment-status'>
                <div className='text'>{props.order.payment_status_display}</div>
            </td>
        </tr>
    );
};

export default OrdersTableRow;