import React from "react";
import FilterCollapsibleGroup from "./FilterCollapsibleGroup"

const FilterSet = function(props) {
    return (
        <div className='filter-set'>
            <div className='button'>
                <div className='img'></div>
                <div className='text-wrap'>
                    <div className='text'>Фільтри</div>
                </div>
                <div className={`badge-wrap ${Object.keys(props.filterChoice).length > 0 ? 'active' : ''}`}>
                    <div className='text'>{Object.keys(props.filterChoice).length}</div>
                </div>
            </div>
            <div className='filterSideBar'>
                <div className='filterHeader'>
                    <div className='title'>Фільтри таблиці</div>
                    <div className='close-icon'></div>
                </div>
                <div className='filterContent'>
                    {props.items.map((filterItem, index) => 
                        <div key={index} className='filterItem'>
                            <FilterCollapsibleGroup
                                {...filterItem}
                            />
                        </div>
                    )}
                </div>
                <div className='filterFooter'>
                    <div className='doFilterBtn'>Фільтр</div>
                    <div className='cleanFilterBtn'>Скинути</div>
                </div>
            </div>
        </div>
    );
};

export default FilterSet;