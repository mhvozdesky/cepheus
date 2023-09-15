import React, {useState, useEffect} from "react";
import axios from "axios";
import PreLoader from "../components/UI/PreLoader"
import GoodsTable from "../components/GoodsTable"
import SelectOption from "../components/UI/SelectOption"
import LabeledSearch from "../components/UI/LabeledSearch"
import PaginationPanel from "../components/UI/PaginationPanel"
import ButtonAdd from "../components/UI/ButtonAdd"
import ButtonExport from "../components/UI/ButtonExport"
import ButtonDelete from "../components/UI/ButtonDelete"

const GoodsPage = function() {
    const pageSizeDefault = 25;

    const [loadingGoods, setLoadingGoods] = useState(true)
    const [goods, setGoods] = useState([])

    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(pageSizeDefault)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const change_page = (next_page=null, prev_page=null, need_page=null) => {
        let cur_page = page

        if (next_page) {
            cur_page = cur_page + 1;
        }

        if (prev_page) {
            cur_page = cur_page - 1;
        }

        if (need_page) {
            cur_page = need_page;
        }

        getGoods(cur_page);
    }

    const change_page_size = (onPage) => {
        getGoods(1, onPage);
    }

    const fill_pagination = (data) => {
        if (data['next'] !== null) {
            setNext(true)
        } else {
            setNext(false)
        }

        if (data['previous'] !== null) {
            setPrev(true)
        } else {
            setPrev(false)
        }

        setCount(data['count'])
        setPageSize(data['page_size'])
        setPage(data['page'])
        setLastPage(data['last_page'])
    }

    const getGoods = (cur_page=page, onPage=pageSize) => {
        setLoadingGoods(true)
        const url = `/api/v1/goods/?page=${cur_page}&page_size=${onPage}`;

        const headers = {
            "Content-Type": "application/json"
        }

        if (document.cookie) {
            headers['x-csrftoken'] = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1] 
        }

        axios.get(
            url,
            {
                withCredentials: true,
                headers: headers
            }
        )
        .then((response) => {
            setGoods(response.data['results'])
            fill_pagination(response.data)
            setLoadingGoods(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingGoods(false)
        })
    }

    useEffect(() => {
        getGoods();
    }, [])

    if (loadingGoods) {
        return (
            <PreLoader />
        )
    }

    return (
        <div className='page goods-page'>
            <div className='page-header'>
                <LabeledSearch
                    name='search-id'
                    btn_text='ID'
                />
                <LabeledSearch
                    name='search-title'
                    btn_text='Назва'
                />
                <LabeledSearch
                    name='search-vendor-code'
                    btn_text='Артикул'
                />
                <ButtonAdd />
                <ButtonExport />
                <ButtonDelete />
            </div>
            <div className='page-content'>
                <GoodsTable 
                    goods={goods}
                />
            </div>
            <div className='page-footer'>
                <div className='console'>
                    <PaginationPanel
                        next={next}
                        prev={prev}
                        pageSize={pageSize}
                        page={page}
                        lastPage={lastPage}
                        change_page={change_page}
                    />
                    <SelectOption
                        class_name='select-onPage'
                        id='onPage'
                        defaultValue=""
                        pageSize={pageSize}
                        change_page_size={change_page_size}
                        options={[
                            {value: 25, name: "25"},
                            {value: 50, name: "50"},
                            {value: 100, name: "100"},
                            {value: 250, name: "250"},
                            {value: 500, name: "500"}
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default GoodsPage;