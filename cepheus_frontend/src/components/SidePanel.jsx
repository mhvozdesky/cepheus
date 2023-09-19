import React from "react";
import ItemSidePanel from "./ItemSidePanel"
import {useLocation} from "react-router-dom"

const SidePanel = function() {
    const location = useLocation();

    return (
        <div className='side-panel'>
            <div className='blank-block'></div>
            <ItemSidePanel class_name='side-orders' title='Замовлення' url='orders' active={location.pathname.startsWith('/orders')} />
            <ItemSidePanel class_name='side-goods' title='Товари' url='goods' active={location.pathname.startsWith('/goods')} />
            <ItemSidePanel class_name='side-employees' title='Команда' url='employees' active={location.pathname.startsWith('/employees')} />
            <ItemSidePanel class_name='side-customers' title='Покупці' url='customers' active={location.pathname.startsWith('/customers')} />
            <ItemSidePanel class_name='side-categories' title='Категорії' url='categories' active={location.pathname.startsWith('/categories')} />
        </div>
    );
};

export default SidePanel;