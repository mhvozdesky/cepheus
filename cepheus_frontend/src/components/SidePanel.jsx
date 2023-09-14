import React from "react";
import ItemSidePanel from "./ItemSidePanel"

const SidePanel = function() {
    return (
        <div className='side-panel'>
            <div className='blank-block'></div>
            <ItemSidePanel class_name='side-orders' title='Замовлення' url='orders' />
            <ItemSidePanel class_name='side-goods' title='Товари' url='goods' />
        </div>
    );
};

export default SidePanel;