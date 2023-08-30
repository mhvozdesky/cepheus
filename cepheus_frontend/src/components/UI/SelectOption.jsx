import React from "react";

const SelectOption = function(props) {
    const element_class = 'ceph-select' + ' ' + props.class_name;

    const changeHandle = (e) => {
        if (props.change_page_size) {
            props.change_page_size(e.target.value)
        }
    }

    return (
        <select className={element_class} value={props.pageSize} onChange={changeHandle} id={props.id}>
            {props.defaultValue &&
                <option value="">--{props.defaultValue}--</option>
            }
            {props.options.map(option => 
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>    
            )}
        </select>
    );
};

export default SelectOption;