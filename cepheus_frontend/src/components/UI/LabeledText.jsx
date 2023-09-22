import React, {useState, useEffect} from "react";

const LabeledText = function(props) {
    const [localValue, setLocalValue] = useState(props.value || "");

    const changeHandler = (e) => {  
        if (props.readOnly) {
            return
        }
            
        props.change(e.target.id, e.target.value)
    }

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

    return (
        <div className='labeled-text'>
            <label htmlFor={props.input_name}>{props.label_text}</label>
            <div className='text-wrapper'>
                <textarea
                    id={props.name}
                    name={props.name}
                    readOnly={props.readOnly}
                    rows={props.rows}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={(e) => changeHandler(e)}
                >
                    
                </textarea>
            </div>
        </div>
    );
};

export default LabeledText;