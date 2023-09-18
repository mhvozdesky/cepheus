import React from "react";
import CategoriesTableRow from "./CategoriesTableRow"

const CategoriesTable = function(props) {
    return (
        <div className='category-table'>
            <div className='table-header'>
                <div className='col col1 checkbox-column'>
                    <div className='text'><span><input type='checkbox'/></span></div>
                </div>
                <div className='col col2 category-id'>
                    <div className='text'>ID</div>
                </div>
                <div className='col col1 title'>
                    <div className='text'>Назва</div>
                </div>
            </div>
            <div className='table-body'>
                {props.categories.map((category, index) => 
                    <CategoriesTableRow key={category.id} category={category} index={index} />
                )}
            </div>
        </div>
    );
};

export default CategoriesTable;