import React from "react";

const FilterCollapsibleGroup = function(props) {
    return (
        <div className='collapsibleGroup'>
            <div className='title'>
                <div className='icon'>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 16 16">
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