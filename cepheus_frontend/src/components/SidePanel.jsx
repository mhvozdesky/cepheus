import React from "react";
import ItemSidePanel from "./ItemSidePanel"

const SidePanel = function() {
    return (
        <div className='side-panel'>
            <div className='blank-block'></div>
            <ItemSidePanel class_name='side-orders' title='Замовлення' url='orders' />
            <ItemSidePanel class_name='side-goods' title='Товари' url='goods' />
            <ItemSidePanel class_name='side-employees' title='Команда' url='employees' />
            <ItemSidePanel class_name='side-customers' title='Покупці' url='customers' />
            <ItemSidePanel class_name='side-categories' title='Категорії' url='categories' />
        </div>
    );
};

export default SidePanel;