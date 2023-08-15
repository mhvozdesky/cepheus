import React from "react";

const ItemSidePanel = function(props) {
    const class_name = 'item-side-panel' + ' ' + props.class_name;
    return (
        <div className={class_name}>
            <div className='image-wrapper'>
                <div className='image'></div>
            </div>
            <div className='title-wrapper'>
                <div className='title'>
                    {props.title}
                </div>
            </div>
        </div>
    );
};

export default ItemSidePanel;