import React from "react";
import ButtonAdd from "../components/UI/ButtonAdd"
import ButtonExport from "../components/UI/ButtonExport"
import ButtonDelete from "../components/UI/ButtonDelete"
import SelectOption from "../components/UI/SelectOption"

const OrdersPage = function() {
    return (
        <div className='page order-page'>
            <div className='page-header'>
                <ButtonAdd />
                <SelectOption
                    class_name='responsible'
                    defaultValue="Відповідальний"
                    options={[
                        {value: 1, name: "Антон Сурін"},
                        {value: 2, name: "Аліса Срібчук"}
                    ]}
                />
                <SelectOption
                    class_name='status'
                    defaultValue="Статус"
                    options={[
                        {value: 'in_progress', name: "В роботі"},
                        {value: 'canceled', name: "Анульовано"},
                        {value: 'returned', name: "Повернено"},
                        {value: 'shipped', name: "В дорозі"},
                        {value: 'shipped_back', name: "В дорозі назад"},
                        {value: 'completed', name: "Готово"},
                    ]}
                />
                <SelectOption
                    class_name='date'
                    defaultValue="Період"
                    options={[
                    ]}
                />
                <ButtonExport />
                <ButtonDelete />
            </div>
            <div className='page-content'></div>
        </div>
    );
};

export default OrdersPage;