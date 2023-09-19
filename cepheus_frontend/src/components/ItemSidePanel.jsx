import React from "react";
import {useNavigate} from "react-router-dom"

const ItemSidePanel = function(props) {
    const router = useNavigate()

    var class_name = 'item-side-panel' + ' ' + props.class_name;

    if (props.active) {
        class_name = class_name + ' ' + 'active'
    }

    return (
        <div className={class_name} onClick={() => router(`/${props.url}`)} >
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