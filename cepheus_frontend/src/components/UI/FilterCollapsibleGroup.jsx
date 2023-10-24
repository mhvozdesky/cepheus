import React, {useState} from "react";

const FilterCollapsibleGroup = function(props) {
    const [groupIsActive, setgroupIsActive] = useState(false)

    const changeActivity = () => {
        setgroupIsActive(!groupIsActive)
    }

    return (
        <div className={`collapsibleGroup ${groupIsActive ? 'active' : ''}`}>
            <div className='title' onClick={changeActivity}>
                <div className='icon'>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 16 16">
                        <path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>
                    </svg>
                </div>
                <div className='text'>{props.title}</div>
            </div>
            <div className='content'>
                <props.component {...props.componentConfig} />
            </div>
        </div>
    );
};

export default FilterCollapsibleGroup;