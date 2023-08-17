import React from "react";

const OrdersTable = function() {
    return (
        <table className='orders-list'>
            <thead>
                <tr>
                    <th scope='col' className='checkbox-column'>
                        <div className='text'><span><input type='checkbox'/></span></div>
                    </th>
                    <th scope='col' className='id-order'>
                        <div className='text'>ID Замовлення</div>
                    </th>
                    <th scope='col' className='date-creation'>
                        <div className='text'>Дата створення</div>
                    </th>
                    <th scope='col' className='update-date'>
                        <div className='text'>Дата оновлення</div>
                    </th>
                    <th scope='col' className='status-order'>
                        <div className='text'>Статус</div>
                    </th>
                    <th scope='col' className='responsible'>
                        <div className='text'>Відповідальний</div>
                    </th>
                    <th scope='col' className='number'>
                        <div className='text'>К-сть</div>
                    </th>
                    <th scope='col' className='amount'>
                        <div className='text'>Сума</div>
                    </th>
                    <th scope='col' className='payment-status'>
                        <div className='text'>Статус оплати</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr className='row0'>
                    <td className='checkbox'>
                        <div className='text'><span><input type='checkbox'/></span></div>
                    </td>
                    <td className='id-order'>
                        <div className='text'>0543</div>
                    </td>
                    <td className='date-creation'>
                        <div className='text'>09.07.2023</div>
                    </td>
                    <td className='update-date'>
                        <div className='text'>09.07.2023</div>
                    </td>
                    <td className='status-order'>
                        <div className='text'>Оброблено</div>
                    </td>
                    <td className='responsible'>
                        <div className='text'>Антон Сурін</div>
                    </td>
                    <td className='number'>
                        <div className='text'>5</div>
                    </td>
                    <td className='amount'>
                        <div className='text'>3 500,00</div>
                    </td>
                    <td className='payment-status'>
                        <div className='text'>Оплачено</div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default OrdersTable;