import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"
import ButtonAdd from "../components/UI/ButtonAdd"
import ButtonExport from "../components/UI/ButtonExport"
import ButtonDelete from "../components/UI/ButtonDelete"
import SelectOption from "../components/UI/SelectOption"
import PreLoader from "../components/UI/PreLoader"
import PaginationPanel from "../components/UI/PaginationPanel"
import FilterSet from "../components/UI/FilterSet"
import FilterCollapsibleGroup from "../components/UI/FilterCollapsibleGroup"
import FilterList from "../components/UI/FilterList"
import FilterDateRange from "../components/UI/FilterDateRange"
import OrdersTable from "../components/OrdersTable"
import UniversalSearch from "../components/UI/UniversalSearch"
import {get_search_string, get_filter_string} from "../utils"
import axios from "axios";

const OrdersPage = function(props) {
    const router = useNavigate()

    const pageSizeDefault = 25;

    const [loadingOrders, setLoadingOrders] = useState(false)
    const [orders, setOrders] = useState([])

    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(pageSizeDefault)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [orderSelected, setOrderSelected] = useState(null)
    const [filterChoice, setFilterChoice] = useState({}) 
    const [searchInputId, setSearchInputId] = useState({name: 'ID', values: [''], field: 'id'})
    const [searchInputResponsible, setSearchInputResponsible] = useState({name: 'Відповідальний', values: [''], field: 'responsible_full_name'})
    const [searchInputCustomer, setSearchInputCustomer] = useState({name: 'Email замовника', values: [''], field: 'customer_email'})

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

        getOrders({cur_page:cur_page});
    }

    const change_page_size = (onPage) => {
        getOrders({cur_page: 1, onPage: onPage});
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

    const add_script = () => {
        const scr = document.querySelector(".work-space");
        let isDragging = false;
        let startX;

        if (scr) {
          if (scr.scrollWidth > scr.parentElement.clientWidth) {
            scr.style.overflowX = "scroll";
          }
    
          const handleMouseDown = (event) => {
            if (event.button === 0) {
              isDragging = true;
              startX = scr.scrollLeft + event.clientX;
            }
          };
    
          const handleMouseMove = (event) => {
            if (isDragging) {
              // event.preventDefault();
              const scrollX = startX - event.clientX;
              scr.scrollLeft = scrollX;
            }
          };
    
          const handleMouseUp = () => {
            isDragging = false;
          };
    
          scr.addEventListener("mousedown", handleMouseDown);
          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener("mouseup", handleMouseUp);
        }
      }

    const getOrders = ({cur_page=page, onPage=pageSize, filterString=''} = {}) => {
        setLoadingOrders(true)
        let url = `/api/v1/orders/?page=${cur_page}&page_size=${onPage}`;

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
            setOrders(response.data['results'])
            fill_pagination(response.data)
            setLoadingOrders(false)
        })
        .catch((error) => {
            console.log(error.response)
            setLoadingOrders(false)
        })
    }

    const filterStatusConfig = {
        component: FilterList,
        componentConfig: {
            items: [
                {name: '', value: "Всі"},
                {name: 'in_progress', value: "В роботі"},
                {name: 'canceled', value: "Анульовано"},
                {name: 'returned', value: "Повернено"},
                {name: 'shipped', value: "В дорозі"},
                {name: 'shipped_back', value: "В дорозі назад"},
                {name: 'completed', value: "Готово"},
            ],
            name: 'status',
            filterChoice: filterChoice,
            setFilterChoice: setFilterChoice
        },
        title: 'Статус'
    }

    const filterPaymentStatusConfig = {
        component: FilterList,
        componentConfig: {
            items: [
                {name: '', value: "Всі"},
                {name: 'not_paid', value: "Не оплачено"},
                {name: 'partially_paid', value: "Частково оплачено"},
                {name: 'paid', value: "Оплачено"},
                {name: 'overpaid', value: "Переплачено"}
            ],
            name: 'payment_status',
            filterChoice: filterChoice,
            setFilterChoice: setFilterChoice
        },
        title: 'Статус оплати'
    }

    const filterDateCreated = {
        component: FilterDateRange,
        componentConfig: {
            name: 'created',
            filterChoice: filterChoice,
            setFilterChoice: setFilterChoice
        },
        title: 'Дата створення'
    }

    const filterDateModified = {
        component: FilterDateRange,
        componentConfig: {
            name: 'modified',
            filterChoice: filterChoice,
            setFilterChoice: setFilterChoice
        },
        title: 'Дата оновлення'
    }

    const doSearch = (mark) => {
        const stringsList = []
        if (mark === 'all' || mark === 'search') {
            const search_fields = [searchInputId, searchInputResponsible, searchInputCustomer]
            const searchString = get_search_string(search_fields)
            stringsList.push(searchString)
        }

        if (mark === 'all' || mark === 'filter') {
            const filterString = get_filter_string(filterChoice)
            stringsList.push(filterString)
        }

        getOrders({filterString: stringsList.join('&')});
    }

    const searchHandler = () => {
        doSearch('all')
    }

    const clearSearch = () => {
        doSearch('filter')
    }

    const clearFilter = () => {
        doSearch('search')
    }

    useEffect(() => {
        getOrders();
      }, [])

    useEffect(() => {
        if (orderSelected == null) {
            return
        }

        if (props.modalDirect) {
            props.modalSelection(props.index, orderSelected, props.field)
        } else {
            router(`/orders/${orderSelected}`)
        }

        setOrderSelected(null);
    }, [orderSelected])

    if (loadingOrders) {
        return (
            <PreLoader />
        )
    }

    return (
        <div className='page order-page'>
            <div className='page-header'>
                <div className='header-part part0'>
                    <ButtonAdd />
                    <FilterSet
                        items={[filterStatusConfig, filterPaymentStatusConfig, filterDateCreated, filterDateModified]}
                        filterChoice={filterChoice}
                        setFilterChoice={setFilterChoice}
                        filterHandler={searchHandler}
                        clearFilter={clearFilter}
                    />
                    <UniversalSearch 
                        listInputs={[
                            {state: searchInputId, setState: setSearchInputId}, 
                            {state: searchInputResponsible, setState: setSearchInputResponsible},
                            {state: searchInputCustomer, setState: setSearchInputCustomer}
                        ]}
                        searchHandler={searchHandler}
                        clearFilter={clearSearch}
                    />
                </div>
                <div className='header-part part1'>
                    <ButtonExport />
                    <ButtonDelete />
                </div>
            </div>
            <div className='page-content'>
                <div className='block-table'>
                    <OrdersTable orders={orders} setOrderSelected={setOrderSelected} />
                </div>
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

export default OrdersPage;