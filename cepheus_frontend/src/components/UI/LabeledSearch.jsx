import React from "react";

const LabeledSearch = function(props) {
    return (
        <div className={`labeled-search ${props.name}`}>
            <div className='label'>
                <div className='text'>{props.btn_text}</div>
            </div>
            <div className='search-block'>
                <input type='search' placeholder='Пошук' />
                <div className='btn'></div>
            </div>
        </div>
    );
};

export default LabeledSearch;