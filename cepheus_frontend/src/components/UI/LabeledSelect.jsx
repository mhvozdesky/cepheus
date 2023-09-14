import React from "react";

const LabeledSelect = function(props) {
    return (
        <div className={`labeled-select ${props.name}`}>
            <label htmlFor={props.name}>{props.label_text}</label>
            <select
                value={props.value}
                id={props.name}
                onChange={(e) => props.change(e.target.id, e.target.value)}
            >
                {props.options.map(option => 
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>    
                )}
            </select>
        </div>
    );
};

export default LabeledSelect;