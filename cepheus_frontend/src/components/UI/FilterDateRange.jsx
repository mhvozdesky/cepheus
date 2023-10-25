import React, {useState} from "react";
import DatePicker from "react-datepicker";
import { uk } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const FilterDateRange = function() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const manualChange = (date) => {
        // const year = date.getFullYear();
        // const month = String(date.getMonth() + 1).padStart(2, '0');
        // const day = String(date.getDate()).padStart(2, '0');
        // const formattedDate = `${year}-${month}-${day}`;
        // console.log(formattedDate);
        setStartDate(date)
    }

    return (
        <div className='dateFilter'>
            <div className='dateRow'>
                <div className='rowTitle'>З</div>
                <DatePicker
                    selectsStart
                    selected={startDate}
                    onChange={(date) => manualChange(date)}
                    dateFormat='dd.MM.yyyy'
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate}
                    locale={uk}
                    placeholderText="__.__.____"
                    isClearable={true}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
            </div>
            <div className='dateRow'>
                <div className='rowTitle'>по</div>
                <DatePicker
                    selectsEnd
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat='dd.MM.yyyy'
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    locale={uk}
                    placeholderText="__.__.____"
                    isClearable={true}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
            </div>
        </div>
    );
};

export default FilterDateRange;