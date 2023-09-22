import React from "react";

const LabeledText = function(props) {
    const changeHandler = (e) => {  
        if (props.readOnly) {
            return
        }
            
        props.change(e.target.id, e.target.value)
    }

    return (
        <div className='labeled-text'>
            <label htmlFor={props.input_name}>{props.label_text}</label>
            <div className='text-wrapper'>
                <textarea
                    id={props.name}
                    name={props.name}
                    readOnly={props.readOnly}
                    rows={props.rows}
                    defaultValue={props.value}
                    onBlur={(e) => changeHandler(e)}
                >
                    
                </textarea>
            </div>
        </div>
    );
};

export default LabeledText;