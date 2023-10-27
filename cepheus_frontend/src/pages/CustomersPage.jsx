import React, {useState, useEffect} from "react";
import axios from "axios";
import PreLoader from "../components/UI/PreLoader"
import CustomerTable from "../components/CustomerTable"
import SelectOption from "../components/UI/SelectOption"
import LabeledSearch from "../components/UI/LabeledSearch"
import PaginationPanel from "../components/UI/PaginationPanel"
import UniversalSearch from "../components/UI/UniversalSearch"
import {get_search_string} from "../utils"

const CustomersPage = function(props) {
    const pageSizeDefault = 25;

    const [loadingCustomers, setLoadingCustomers] = useState(true)
    const [customers, setCustomers] = useState([])

    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(pageSizeDefault)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const [customerSelected, setCustomerSelected] = useState(null)

    const [searchInputId, setSearchInputId] = useState({name: 'ID', values: [''], field: 'id'})
    const [searchInputFullName, setSearchInputFullName] = useState({name: "Ім'я", values: [''], field: 'full_name'})
    const [searchInputEmail, setSearchInputEmail] = useState({name: 'Email', values: [''], field: 'email'})

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

        getCustomers({cur_page: cur_page});
    }

    const change_page_size = (onPage) => {
        getCustomers({cur_page: 1, onPage: onPage});
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

    const getCustomers = ({cur_page=page, onPage=pageSize, filterString=''} = {}) => {
        setLoadingCustomers(true)
        let url = `/api/v1/customers/?page=${cur_page}&page_size=${onPage}`;

        if (filterString !== '') {
            url = url + '&' + filterString;
        }

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

    const searchHandler = () => {
        const search_fields = [searchInputId, searchInputFullName, searchInputEmail]
        const searchString = get_search_string(search_fields)
        getCustomers({filterString: searchString});
    }

    const clearSearch = () => {
        getCustomers()
    }

    useEffect(() => {
        getCustomers();
    }, [])

    useEffect(() => {
        if (customerSelected == null) {
            return
        }

        if (props.modalDirect) {
            props.modalSelection(props.index, customerSelected, props.field)
        } else {
            // router(`/orders/${goodSelected}`)
            // router(`/orders/217`)
        }

        setCustomerSelected(null);
    }, [customerSelected])

    if (loadingCustomers) {
        return (
            <PreLoader />
        )
    }

    return (
        <div className='page customers-page'>
            <div className='page-header'>
                <UniversalSearch 
                    listInputs={[
                        {state: searchInputId, setState: setSearchInputId}, 
                        {state: searchInputFullName, setState: setSearchInputFullName},
                        {state: searchInputEmail, setState: setSearchInputEmail}
                    ]}
                    searchHandler={searchHandler}
                    clearFilter={clearSearch}
                />
            </div>
            <div className='page-content'>
                <CustomerTable
                    customers={customers}
                    setCustomerSelected={setCustomerSelected}
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

export default CustomersPage;