import React, {useState} from "react";
import FilterCollapsibleGroup from "./FilterCollapsibleGroup"

const FilterSet = function(props) {
    const [sidebarVisibility, setSidebarVisibility] = useState(false)

    const invertSidebarVisibility = () => {
        setSidebarVisibility(!sidebarVisibility);
    }

    const turnOffSidebar = () => {
        setSidebarVisibility(false)
    }

    const cleanFilter = () => {
        props.setFilterChoice({})
    }

    return (
        <div className='filter-set'>
            <div className='button' onClick={invertSidebarVisibility}>
                <div className='img'></div>
                <div className='text-wrap'>
                    <div className='text'>Фільтри</div>
                </div>
                <div className={`badge-wrap ${Object.keys(props.filterChoice).length > 0 ? 'active' : ''}`}>
                    <div className='text'>{Object.keys(props.filterChoice).length}</div>
                </div>
            </div>
            <div className={`filterSideBar ${sidebarVisibility ? 'active' : ''}`}>
                <div className='filterHeader'>
                    <div className='title'>Фільтри таблиці</div>
                    <div className='close-icon' onClick={turnOffSidebar}></div>
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
                    <div className='cleanFilterBtn' onClick={cleanFilter}>Скинути</div>
                </div>
            </div>
        </div>
    );
};

export default FilterSet;