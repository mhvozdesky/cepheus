import React, {useState, useEffect} from "react";
import axios from "axios";
import PreLoader from "../components/UI/PreLoader"
import CustomerTable from "../components/CustomerTable"
import SelectOption from "../components/UI/SelectOption"
import LabeledSearch from "../components/UI/LabeledSearch"
import PaginationPanel from "../components/UI/PaginationPanel"
import ButtonAdd from "../components/UI/ButtonAdd"
import ButtonExport from "../components/UI/ButtonExport"
import ButtonDelete from "../components/UI/ButtonDelete"

const CustomersPage = function() {
    const pageSizeDefault = 25;

    const [loadingCustomers, setLoadingCustomers] = useState(true)
    const [customers, setCustomers] = useState([])

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

        getCustomers(cur_page);
    }

    const change_page_size = (onPage) => {
        getCustomers(1, onPage);
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

    const getCustomers = (cur_page=page, onPage=pageSize) => {
        setLoadingCustomers(true)
        const url = `/api/v1/customers/?page=${cur_page}&page_size=${onPage}`;

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
            setCustomers(response.data['results'])
            fill_pagination(response.data)
            setLoadingCustomers(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingCustomers(false)
        })
    }

    useEffect(() => {
        getCustomers();
    }, [])

    if (loadingCustomers) {
        return (
            <PreLoader />
        )
    }

    return (
        <div className='page customers-page'>
            <div className='page-header'></div>
            <div className='page-content'>
                <CustomerTable
                    customers={customers}
                />
            </div>
            <div className='page-footer'></div>
        </div>
    );
};

export default CustomersPage;