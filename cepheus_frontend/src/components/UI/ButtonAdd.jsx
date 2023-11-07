import React from "react";

const ButtonAdd = function(props) {
    return (
        <div className='button-add' onClick={props.onButtonAdd} >
            <div className='image'></div>
        </div>
    );
};

export default ButtonAdd;