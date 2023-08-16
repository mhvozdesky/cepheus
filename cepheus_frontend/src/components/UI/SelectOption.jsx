import React from "react";

const SelectOption = function({class_name, options, defaultValue, value}) {
    const element_class = 'ceph-select' + ' ' + class_name;
    return (
        <select className={element_class}>
            <option value="">--{defaultValue}--</option>
            {options.map(option => 
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>    
            )}
        </select>
    );
};

export default SelectOption;