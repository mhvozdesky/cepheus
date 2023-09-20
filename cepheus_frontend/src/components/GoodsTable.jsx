import React from "react";
import GoodTableRow from "./GoodTableRow"

const GoodsTable = function(props) {
    return (
        <div className='goods-table'>
            <div className='table-header'>
                <div className='col col1 checkbox-column'>
                    <div className='text'><span><input type='checkbox'/></span></div>
                </div>
                <div className='col col2 good-id'>
                    <div className='text'>ID</div>
                </div>
                <div className='col col1 title'>
                    <div className='text'>Назва</div>
                </div>
                <div className='col col2 vendor-code'>
                    <div className='text'>Артикул</div>
                </div>
                <div className='col col1 category'>
                    <div className='text'>Категорія</div>
                </div>
                <div className='col col2 price'>
                    <div className='text'>Ціна</div>
                </div>
                <div className='col col1 stock-balance'>
                    <div className='text'>Залишок</div>
                </div>
            </div>
            <div className='table-body'>
                {props.goods.map((good, index) => 
                    <GoodTableRow key={good.id} good={good} index={index} setGoodSelected={props.setGoodSelected} />
                )}
            </div>
        </div>
    );
};

export default GoodsTable;