import React from "react";

const CategoriesTableRow = function(props) {
    return (
        <div className={`row row${props.index}`}>
            <div className='row-item checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </div>
            <div className='row-item id'>
                <div className='text'>{props.category.id}</div>
            </div>
            <div className='row-item title'>
                <div className='text'>{props.category.title}</div>
            </div>
        </div>
    );
};

export default CategoriesTableRow;