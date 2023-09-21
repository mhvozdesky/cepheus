import React from "react";
import CustomerTableRow from "./CustomerTableRow"

const CustomerTable = function(props) {
    return (
        <div className='customer-table'>
            <div className='table-header'>
                <div className='col col1 checkbox-column'>
                    <div className='text'><span><input type='checkbox'/></span></div>
                </div>
                <div className='col col2 employee-id'>
                    <div className='text'>ID</div>
                </div>
                <div className='col col1 full-name'>
                    <div className='text'>Ім'я</div>
                </div>
                <div className='col col2 email'>
                    <div className='text'>Email</div>
                </div>
                <div className='col col1 phone'>
                    <div className='text'>Номер телефону</div>
                </div>
            </div>
            <div className='table-body'>
                {props.customers.map((customer, index) => 
                    <CustomerTableRow key={customer.id} customer={customer} index={index} setCustomerSelected={props.setCustomerSelected} />
                )}
            </div>
        </div>
    );
};

export default CustomerTable;