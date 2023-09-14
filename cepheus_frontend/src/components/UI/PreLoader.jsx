import React from "react";

const PreLoader = function(props) {
    return (
        <svg className="spinner" viewBox="0 0 50 50" id={props.id}>
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
    );
};

export default PreLoader;