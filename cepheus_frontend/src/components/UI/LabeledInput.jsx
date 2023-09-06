import React from "react";

const LabeledInput = function(props) {
    return (
        <div className={`labeled-input ${props.input_name}`}>
            <label htmlFor={props.input_name}>{props.label_text}</label>
            <div className='content-block'>
                <div className='text-wrapper'>
                    <input type="text" id={props.input_name} name={props.input_name} value={props.value} onChange={(e) => props.change(e.target.value)} />
                </div>
                <div className='list-btn'></div>
                <div className='detail-btn'></div>
            </div>
        </div>
    );
};

export default LabeledInput;