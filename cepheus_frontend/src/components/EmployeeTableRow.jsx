import React from "react";

const EmployeeTableRow = function(props) {
    return (
        <div className={`row row${props.index}`} onDoubleClick={() => props.setEmployeeSelected(props.employee.id)}>
            <div className='row-item checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </div>
            <div className='row-item id'>
                <div className='text'>{props.employee.id}</div>
            </div>
            <div className='row-item full-name'>
                <div className='text'>{`${props.employee.first_name} ${props.employee.last_name}`}</div>
            </div>
            <div className='row-item email'>
                <div className='text'>{props.employee.email}</div>
            </div>
            <div className='row-item phone'>
                <div className='text'>{props.employee.phone_number}</div>
            </div>
        </div>
    );
};

export default EmployeeTableRow;