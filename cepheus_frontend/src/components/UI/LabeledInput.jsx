import React from "react";

const LabeledInput = function(props) {
    var mainClassName = `labeled-input ${props.input_name}`

    if (props.control_elem) {
        mainClassName = mainClassName + ' is-control-elem'
    }

    return (
        <div className={mainClassName}>
            <label htmlFor={props.input_name}>{props.label_text}</label>
            <div className='content-block'>
                <div className='text-wrapper'>
                    <input
                        type="text"
                        id={props.input_name}
                        name={props.input_name}
                        value={props.value}
                        onChange={(e) => props.change(e.target.id, e.target.value)}
                        readOnly={props.readOnly}
                    />
                </div>
                {props.control_elem &&
                    <>
                        <div className='list-btn'></div>
                        <div className='detail-btn'></div>
                    </>
                }
            </div>
        </div>
    );
};

export default LabeledInput;