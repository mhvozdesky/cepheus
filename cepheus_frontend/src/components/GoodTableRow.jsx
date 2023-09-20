import React from "react";

const GoodTableRow = function(props) {
    return (
        <div className={`row row${props.index}`} onDoubleClick={() => props.setGoodSelected(props.good.id)}>
            <div className='row-item checkbox'>
                <div className='text'><span><input type='checkbox'/></span></div>
            </div>
            <div className='row-item id'>
                <div className='text'>{props.good.id}</div>
            </div>
            <div className='row-item title'>
                <div className='text'>{props.good.title}</div>
            </div>
            <div className='row-item vendor_code'>
                <div className='text'>{props.good.vendor_code}</div>
            </div>
            <div className='row-item category_display'>
                <div className='text'>{props.good.category_display}</div>
            </div>
            <div className='row-item price'>
                <div className='text'>{props.good.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</div>
            </div>
            <div className='row-item stock_balance'>
                <div className='text'>{props.good.stock_balance}</div>
            </div>
        </div>
    );
};

export default GoodTableRow;