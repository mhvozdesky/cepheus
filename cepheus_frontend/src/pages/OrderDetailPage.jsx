import React from "react";
import {useParams} from "react-router-dom"

const OrderDetailPage = function() {
    const route_params = useParams();

    return (
        <div>
            Order detail page {route_params.id}
        </div>
    );
};

export default OrderDetailPage;