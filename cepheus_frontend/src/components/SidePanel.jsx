import React from "react";
import ItemSidePanel from "./ItemSidePanel"

const SidePanel = function() {
    return (
        <div className='side-panel'>
            <ItemSidePanel class_name='side-orders' title='Замовлення' url='orders' />
            <ItemSidePanel class_name='side-orders' title='Товари' url='orders' />
        </div>
    );
};

export default SidePanel;