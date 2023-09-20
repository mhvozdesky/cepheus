import React from "react";

const ModalOrders = function(props) {
    var mainClassName = 'modal-list orders'

    if (props.visible) {
        mainClassName = mainClassName + ' ' + 'active'
    }

    return (
        <div className={mainClassName} onClick={() => props.setVisible(false)}>
            <div className='content' onClick={(e) => e.stopPropagation()}>
                {props.content}
            </div>
        </div>
    );
};

export default ModalOrders;