import React, {useState, useEffect} from "react";

const UniversalSearch = function(props) {
    const [searchText, setSearchText] = useState('Пошук')
    const [searchBlockClsnm, setSearchBlockClsnm] = useState('search-block')
    const [showSearchInputs, setShowSearchInputs] = useState(false)
    const [changeInputText, setChangeInputText] = useState(false)

    const changeShowSearchBlock = () => {
        setShowSearchInputs(!showSearchInputs)
    }

    const openSearchBlock = () => {
        setSearchBlockClsnm('search-block active')
    }

    const closeSearchBlock = () => {
        setSearchBlockClsnm('search-block')
    }

    // The function that is called when the search button is clicked
    const handlerSearchBtn = () => {
        setShowSearchInputs(false) // Hide search fields
        props.searchHandler() // We perform a basic search
        generateInputText()
    }

    // A function to create a new state and a new array of values
    const get_new_data = (cur_state) => {
        const newState = {...cur_state}; // We copy the current state
        const newValues = [...newState.values]; // We copy the array of values
        return {newState, newValues} // We return the new state and new values
    }

    // A function to get the current state and a state change function for the specified index
    const get_cur_state = (index) => {
        const cur_state = props.listInputs[index].state
        const func_change_state = props.listInputs[index].setState
        return {cur_state, func_change_state}
    }

    // A function to handle input changes
    const InputChangeHandler = (index, indexValue, value) => {
        const {cur_state, func_change_state} = get_cur_state(index)
        const {newState, newValues} = get_new_data(cur_state)

        newValues[indexValue] = value; // We update the value
        newState.values = newValues; // We update the array of values in the state

        func_change_state(newState) // We update the status
    }

    // Function for adding a new line (element) to the array of values
    const addNewLine = (index) => {
        const {cur_state, func_change_state} = get_cur_state(index)
        const {newState, newValues} = get_new_data(cur_state)

        newValues.push('') // Add a new line
        newState.values = newValues;

        func_change_state(newState)
    }

    // A function for removing a row (element) from an array of values
    const removeLine = (index, indexValue) => {
        const {cur_state, func_change_state} = get_cur_state(index)
        let {newState, newValues} = get_new_data(cur_state)

        if (cur_state.values.length === 1) {
            newValues = [''] // If there is only one element, replace it with an empty line
        } else {
            newValues = newValues.filter((item, index) => index !== indexValue)
        }
        newState.values = newValues;
        func_change_state(newState)
    }

    // A function to clear all input fields for the specified index
    const clearInputFields = (inputIndex) => {
        const {cur_state, func_change_state} = get_cur_state(inputIndex)
        let {newState, newValues} = get_new_data(cur_state)
        newValues = [''] // Clear the array of values
        newState.values = newValues;
        func_change_state(newState)
    }

    // Function to clear all input fields
    const clearAllFields = () => {
        for (let i=0; i < props.listInputs.length; i++){
            clearInputFields(i) // Clear each input field
        }
        setChangeInputText(true)
        props.clearFilter()
    }

    const generateInputText = () => {
        let textList = [];
        for (let i=0; i < props.listInputs.length; i++) {
            let valueList = props.listInputs[i].state.values;
            if (valueList.length === 1 && valueList[0] === '') {
                continue
            }
            valueList.map((item) => textList.push(`"${item}"`))
        }

        let newText = textList.join(', ')
        if (newText === '') {
            newText = 'Пошук'
        }
        setSearchText(newText)
    }

    useEffect(() => {
        if (showSearchInputs) {
            openSearchBlock()
        } else {
            closeSearchBlock()
        }
    }, [showSearchInputs])

    useEffect(() => {
        if (changeInputText) {
            generateInputText()
            setChangeInputText(false)
        }
    }, [props.listInputs])

    useEffect(() => {
        generateInputText()
    }, [])

    return (
        <div className='universal-search'>
            <div className='search-line'>
                <div className={searchBlockClsnm}>
                    <div className='searchInput'>
                        <div className='icon-block'>
                            <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink" 
                                    viewBox="0 0 502.173 502.173" xmlSpace="preserve">
                                <g>
                                    <g>
                                        <g>
                                            <path d="M494.336,443.646L316.402,265.713c20.399-31.421,30.023-68.955,27.189-106.632
                                                C340.507,118.096,322.783,79.5,293.684,50.4C261.167,17.884,217.984,0,172.023,0c-0.222,0-0.445,0.001-0.668,0.001
                                                C125.149,0.176,81.837,18.409,49.398,51.342c-66.308,67.316-65.691,176.257,1.375,242.85
                                                c29.112,28.907,67.655,46.482,108.528,49.489c37.579,2.762,75.008-6.867,106.343-27.21l177.933,177.932
                                                c5.18,5.18,11.984,7.77,18.788,7.77s13.608-2.59,18.789-7.769l13.182-13.182C504.695,470.862,504.695,454.006,494.336,443.646z
                                                M480.193,467.079l-13.182,13.182c-2.563,2.563-6.73,2.561-9.292,0L273.914,296.456c-1.936-1.937-4.497-2.929-7.074-2.929
                                                c-2.044,0-4.098,0.624-5.858,1.898c-60.538,43.788-143.018,37.3-196.118-15.425C5.592,221.146,5.046,124.867,63.646,65.377
                                                c28.67-29.107,66.949-45.222,107.784-45.376c0.199,0,0.392-0.001,0.591-0.001c40.617,0,78.785,15.807,107.52,44.542
                                                c53.108,53.108,59.759,135.751,15.814,196.509c-2.878,3.979-2.441,9.459,1.032,12.932l183.806,183.805
                                                C482.755,460.35,482.755,464.517,480.193,467.079z"/>
                                            <path d="M259.633,84.449c-48.317-48.316-126.935-48.316-175.253,0c-23.406,23.406-36.296,54.526-36.296,87.627
                                                c0,33.102,12.89,64.221,36.296,87.627S138.906,296,172.007,296c33.102,0,64.222-12.891,87.627-36.297
                                                C307.951,211.386,307.951,132.767,259.633,84.449z M245.492,245.561C225.863,265.189,199.766,276,172.007,276
                                                c-27.758,0-53.856-10.811-73.484-30.44c-19.628-19.628-30.438-45.726-30.438-73.484s10.809-53.855,30.438-73.484
                                                c20.262-20.263,46.868-30.39,73.484-30.39c26.61,0,53.227,10.133,73.484,30.39C286.011,139.112,286.011,205.042,245.492,245.561z
                                                "/>
                                            <path d="M111.017,153.935c1.569-5.296-1.452-10.861-6.747-12.43c-5.294-1.569-10.86,1.451-12.429,6.746
                                                c-8.73,29.459-0.668,61.244,21.04,82.952c1.952,1.952,4.512,2.929,7.071,2.929s5.118-0.977,7.071-2.928
                                                c3.905-3.906,3.905-10.238,0-14.143C110.506,200.544,104.372,176.355,111.017,153.935z"/>
                                            <path d="M141.469,94.214c-10.748,4.211-20.367,10.514-28.588,18.735c-3.905,3.906-3.905,10.238,0,14.143
                                                c1.952,1.952,4.512,2.929,7.071,2.929s5.118-0.977,7.07-2.929c6.26-6.26,13.575-11.057,21.741-14.255
                                                c5.143-2.015,7.678-7.816,5.664-12.959C152.413,94.735,146.611,92.202,141.469,94.214z"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div className='emptySearchInput'>
                            <div className='display' onClick={changeShowSearchBlock}>
                                <div className='text'>{searchText}</div>
                            </div>
                            <div className='clear' onClick={clearAllFields}>
                                <svg id="Layer_1" version="1.1" height="20px" width="20px" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <path d="M284.3,245.1l110.9-110.9c7.8-7.8,7.8-20.5,0-28.3s-20.5-7.8-28.3,0L256,216.8L145.1,105.9 
                                    c-7.8-7.8-20.5-7.8-28.3,0s-7.8,20.5,0,28.3l110.9,110.9L116.9,355.9c-7.8,7.8-7.8,20.5,0,28.3c3.9,3.9,9,5.9,14.1,5.9 
                                    c5.1,0,10.2-2,14.1-5.9L256,273.3l110.9,110.9c3.9,3.9,9,5.9,14.1,5.9s10.2-2,14.1-5.9c7.8-7.8,7.8-20.5,0-28.3L284.3,245.1z"/>
                                </svg>
                            </div>
                            <div className='direction' onClick={changeShowSearchBlock}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 16 16">
                                    <path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='search-inputs'>
                        <div className='inputs-block'>
                            {props.listInputs.map((item, index) => 
                                <div key={index} className='line'>
                                    <span>{item.state.name}</span>
                                    <div className='line-field'>
                                        {item.state.values.map((inputValue, valueIndex) =>
                                            <div key={valueIndex} className='line-wrapper'>
                                                <div className='inputWrapper'>
                                                    <input type='text' value={inputValue} onChange={(e) => InputChangeHandler(index, valueIndex, e.target.value)} />
                                                </div>
                                                <div className='addIcon' onClick={(e) => addNewLine(index)}>
                                                    <svg height="18px" width="18px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 455 455" xmlSpace="preserve">
                                                        <polygon points="455,212.5 242.5,212.5 242.5,0 212.5,0 212.5,212.5 0,212.5 0,242.5 212.5,242.5 212.5,455 242.5,455 242.5,242.5 
                                                        455,242.5 "/>
                                                    </svg>
                                                </div>
                                                <div className='icon' onClick={(e) => removeLine(index, valueIndex)}>
                                                    <svg id="Layer_1" version="1.1" height="20px" width="20px" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <path d="M284.3,245.1l110.9-110.9c7.8-7.8,7.8-20.5,0-28.3s-20.5-7.8-28.3,0L256,216.8L145.1,105.9 
                                                        c-7.8-7.8-20.5-7.8-28.3,0s-7.8,20.5,0,28.3l110.9,110.9L116.9,355.9c-7.8,7.8-7.8,20.5,0,28.3c3.9,3.9,9,5.9,14.1,5.9 
                                                        c5.1,0,10.2-2,14.1-5.9L256,273.3l110.9,110.9c3.9,3.9,9,5.9,14.1,5.9s10.2-2,14.1-5.9c7.8-7.8,7.8-20.5,0-28.3L284.3,245.1z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='searchButton' onClick={handlerSearchBtn}><span>Пошук</span></div>
            </div>
        </div>
    );
};

export default UniversalSearch;