import React from "react";
import EmployeeTableRow from "./EmployeeTableRow"

const EmployeesTable = function(props) {
    return (
        <div className='employees-table'>
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
                {props.employees.map((employee, index) => 
                    <EmployeeTableRow key={employee.id} employee={employee} index={index} />
                )}
            </div>
        </div>
    );
};

export default EmployeesTable;