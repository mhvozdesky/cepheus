import React from "react";

const FilterSet = function() {
    return (
        <div className='filter-set'>
            <div className='button'>
                <div className='img'></div>
                <div className='text-wrap'>
                    <div className='text'>Фільтри</div>
                </div>
                <div className='badge-wrap'>
                    <div className='text'>1</div>
                </div>
            </div>
            <div className='filterSideBar'>
                <div className='filterHeader'>
                    <div className='title'>Фільтри таблиці</div>
                    <div className='close-icon'></div>
                </div>
                <div className='filterContent'></div>
                <div className='filterFooter'>
                    <div className='doFilterBtn'>Фільтр</div>
                    <div className='cleanFilterBtn'>Скинути</div>
                </div>
            </div>
        </div>
    );
};

export default FilterSet;