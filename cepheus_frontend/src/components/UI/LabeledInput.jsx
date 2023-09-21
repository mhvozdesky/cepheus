import React, {useState, useEffect} from "react";

const LabeledInput = function(props) {
    const [localValue, setLocalValue] = useState(props.value || "");

    var mainClassName = `labeled-input ${props.input_name}`

    if (props.control_elem) {
        mainClassName = mainClassName + ' is-control-elem'
    }

    const changeHandle = (e) => {
        if (props.readOnly) {
            return
        }
        
        if (props.index !== null) {
            props.change(props.index, e.target.id, e.target.value)
        } else {
            props.change(e.target.id, e.target.value)
        }
        setLocalValue(props.value)
    }

    const clickListBtn = () => {
        if (props.listInfo) {
            const listInfo = props.listInfo;
            listInfo.setComponent(listInfo.Component)
            listInfo.form(true);
        }
    }

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

    return (
        <div className={mainClassName}>
            {props.input_name !== '' && 
                <label htmlFor={props.input_name}>{props.label_text}</label>
            }
            <div className='content-block'>
                <div className='text-wrapper'>
                    <input
                        type={props.type}
                        id={props.input_name}
                        name={props.input_name}
                        value={localValue}
                        onBlur={(e) => changeHandle(e)}
                        onChange={(e) => setLocalValue(e.target.value)}
                        readOnly={props.readOnly}
                    />
                </div>
                {props.control_elem &&
                    <>
                        <div className='list-btn' onClick={clickListBtn}></div>
                        <div className='detail-btn'></div>
                    </>
                }
            </div>
        </div>
    );
};

export default LabeledInput;