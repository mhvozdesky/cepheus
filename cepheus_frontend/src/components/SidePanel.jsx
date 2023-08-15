import React from "react";
import ItemSidePanel from "./ItemSidePanel"

const SidePanel = function() {
    return (
        <div className='side-panel'>
            <ItemSidePanel class_name='side-orders' title='Замовлення' />
            <ItemSidePanel class_name='side-orders' title='Товари' />
        </div>
    );
};

export default SidePanel;