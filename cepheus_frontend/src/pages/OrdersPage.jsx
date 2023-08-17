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
                <div className='wrapper-period'>
                    <div className='wrapper-date wrapper-date-start'>
                        <label for='date_start'>з</label>
                        <input type='date' name='date_start' lang='uk'/>
                    </div>
                    <div className='wrapper-date wrapper-date-end'>
                        <label for='date_end'>по</label>
                        <input type='date' name='date_end' lang='uk'/>
                    </div>
                    <SelectOption
                        class_name='date'
                        defaultValue="Період"
                        options={[
                            {value: 'today', name: "Сьогодні"},
                            {value: 'this_week', name: "Поточний тиждень"},
                            {value: 'this_month', name: "Поточний місяць"},
                            {value: 'own_option', name: "Свій варіант"}
                        ]}
                    />
                </div>
                <ButtonExport />
                <ButtonDelete />
            </div>
            <div className='page-content'></div>
        </div>
    );
};

export default OrdersPage;