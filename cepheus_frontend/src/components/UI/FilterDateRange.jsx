import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import { uk } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const FilterDateRange = function(props) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const dateToHuman = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    const dateSelected = (mark, date) => {
        props.setFilterChoice(prevState => {
            const newState = { ...prevState };
        
            if (!newState[props.name]) {
              if (date === null) return newState;
        
              newState[props.name] = { type: "date", value: {} };
            }
        
            if (date === null) {
              delete newState[props.name].value[mark];
            } else {
              newState[props.name].value[mark] = dateToHuman(date);
            }
        
            if (Object.keys(newState[props.name].value).length === 0) {
              delete newState[props.name];
            }
        
            return newState;
        });
    }

    const startSelected = (date) => {
        dateSelected('start', date)
    }

    const endSelected = (date) => {
        dateSelected('end', date)
    }

    const defineDate = () => {
        if (!props.filterChoice[props.name]) {
            setStartDate(null)
            setEndDate(null)
            return
        }

        const { start, end } = props.filterChoice[props.name].value;
        setStartDate(start ? new Date(start) : null);
        setEndDate(end ? new Date(end) : null);
    }

    useEffect(() => {
        defineDate();
    }, [props.filterChoice])

    useEffect(() => {
        defineDate();
    }, [])

    return (
        <div className='dateFilter'>
            <div className='dateRow'>
                <div className='rowTitle'>З</div>
                <DatePicker
                    selectsStart
                    selected={startDate}
                    onChange={(date) => startSelected(date)}
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
                    onChange={(date) => endSelected(date)}
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