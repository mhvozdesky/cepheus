import React from "react";

const OrdersTableRow = function(props) {
    return (
        <tr className={'row'+props.index}>
            <td className='checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </td>
            <td className='id-order'>
                <div className='text'>{props.order.id}</div>
            </td>
            <td className='date-creation'>
                <div className='text'>{props.order.created_at}</div>
            </td>
            <td className='update-date'>
                <div className='text'>{props.order.modified_at}</div>
            </td>
            <td className='status-order'>
                <div className='text'>{props.order.status}</div>
            </td>
            <td className='responsible'>
                <div className='text'>{props.order.id}</div>
            </td>
            <td className='number'>
                <div className='text'>5</div>
            </td>
            <td className='amount'>
                <div className='text'>3 500,00</div>
            </td>
            <td className='payment-status'>
                <div className='text'>{props.order.payment_status}</div>
            </td>
        </tr>
    );
};

export default OrdersTableRow;