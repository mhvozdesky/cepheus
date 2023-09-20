import React from "react";
import OrdersTableRow from "./OrdersTableRow"

const OrdersTable = function(props) {
    return (
        <table className='orders-list'>
            <thead>
                <tr>
                    <th scope='col' className='checkbox-column col1'>
                        <div className='text'><span><input type='checkbox'/></span></div>
                    </th>
                    <th scope='col' className='id-order col2'>
                        <div className='text'>ID Замовлення</div>
                    </th>
                    <th scope='col' className='date-creation col1'>
                        <div className='text'>Дата створення</div>
                    </th>
                    <th scope='col' className='update-date col2'>
                        <div className='text'>Дата оновлення</div>
                    </th>
                    <th scope='col' className='status-order col1'>
                        <div className='text'>Статус</div>
                    </th>
                    <th scope='col' className='responsible col2'>
                        <div className='text'>Відповідальний</div>
                    </th>
                    <th scope='col' className='number col1'>
                        <div className='text'>К-сть</div>
                    </th>
                    <th scope='col' className='amount col2'>
                        <div className='text'>Сума</div>
                    </th>
                    <th scope='col' className='payment-status col1'>
                        <div className='text'>Статус оплати</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.orders.map((order, index) => 
                    <OrdersTableRow key={order.id} order={order} index={index} setOrderSelected={props.setOrderSelected} />
                )}
            </tbody>
        </table>
    );
};

export default OrdersTable;