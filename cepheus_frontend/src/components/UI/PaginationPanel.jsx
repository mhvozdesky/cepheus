import React from "react";

const PaginationPanel = function() {
    return (
        <div className='pagination-panel'>
            <div className='pagination-block'>
                <a href='' className='item block prev-page-block'>
                    <svg className='svg-pagination svg-prev' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateBeforeIcon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                </a>
                <div className='item block cur-page-block'>
                    <div className='cur-page-wrapper'>
                        <div className='cur-page'>
                            <input className='pagination-input' />
                        </div>
                    </div>
                </div>
                <a href='' className='item block nex-page-block'>
                    <svg className='svg-pagination svg-next' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NavigateNextIcon"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
                </a>
                <span className='item text text-page-block'>із 102</span>
            </div>
            <div className='onPage-block'></div>
        </div>
    );
};

export default PaginationPanel;