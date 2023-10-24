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
import OrdersTable from "../components/OrdersTable"
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

        getOrders(cur_page);
    }

    const change_page_size = (onPage) => {
        getOrders(1, onPage);
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

    const getOrders = (cur_page=page, onPage=pageSize) => {
        setLoadingOrders(true)
        const url = `/api/v1/orders/?page=${cur_page}&page_size=${onPage}`;

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
                        items={[filterStatusConfig, filterPaymentStatusConfig]}
                        filterChoice={filterChoice}
                    />
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
                            <label htmlFor='date_start'>з</label>
                            <input type='date' name='date_start' lang='uk'/>
                        </div>
                        <div className='wrapper-date wrapper-date-end'>
                            <label htmlFor='date_end'>по</label>
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