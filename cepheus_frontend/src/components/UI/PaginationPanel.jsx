import React from "react";

const PaginationPanel = function(props) {

    const handleNextClick = (event) => {
        event.preventDefault();
        props.change_page(true, null, null);
    };

    const handlePrevClick = (event) => {
        event.preventDefault();
        props.change_page(null, true, null);
    };

    const handleCurPageClick = (event) => {
        if (event.key === 'Enter') {
            const curPageValue = event.target.value;
            props.change_page(null, null, curPageValue);
        }
    };

    return (
        <div className='pagination-panel'>
            <div className='pagination-block'>
                <a href='' className={`item block prev-page-block ${props.prev ? '' : 'disabled'}`} onClick={handlePrevClick}>
                    <svg className='svg-pagination svg-prev' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateBeforeIcon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                </a>
                <div className='item block cur-page-block'>
                    <div className='cur-page-wrapper'>
                        <div className='cur-page'>
                            <input className='pagination-input' defaultValue={props.page} onKeyDown={handleCurPageClick} />
                        </div>
                    </div>
                </div>
                <a href='' className={`item block nex-page-block ${props.next ? '' : 'disabled'}`} onClick={handleNextClick}>
                    <svg className='svg-pagination svg-next' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateNextIcon"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
                </a>
                <span className='item text text-page-block'>із {props.lastPage}</span>
            </div>
            <div className='onPage-block'></div>
        </div>
    );
};

export default PaginationPanel;