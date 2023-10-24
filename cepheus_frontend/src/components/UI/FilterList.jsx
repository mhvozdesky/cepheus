import React, {useState, useEffect} from "react";

const FilterList = function(props) {
    const [selectedElement, setSelectedElement] = useState('')

    const selectionChanged = (elem) => {
        let value = elem.dataset.name;
        if (value !== '') {
            props.setFilterChoice(prevState => ({...prevState, [props.name]: value}))
        } else {
            props.setFilterChoice(prevState => {
                const newState = { ...prevState };
                delete newState[props.name];
                return newState;
            });
        }
    }

    const isSelected = (elemName) => {
        if (props.name in props.filterChoice && props.filterChoice[props.name] === elemName) {
            return true
        }
        return false
    }

    const defineElement = () => {
        if (props.name in props.filterChoice) {
            setSelectedElement(props.filterChoice[props.name])
        } else {
            setSelectedElement('')
        }
    }

    useEffect(() => {
        defineElement();
    }, [props.filterChoice])

    useEffect(() => {
        defineElement();
    }, [])

    return (
        <div className='listForm'>
            {props.items.map((item, index) => 
                <div key={index} className="radioButton">
                    <label>
                        <input type="radio" name={props.name} checked={item.name===selectedElement} onChange={(e) => selectionChanged(e.target)} data-name={item.name} />
                        <div className="radioButton__label">
                            {item.value}
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};

export default FilterList;