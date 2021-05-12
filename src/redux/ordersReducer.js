import {Order} from "../models/order";

export const ADD_ORDER = 'orders/ADD_ORDER'
export const FETCH_ORDERS = 'orders/FETCH_ORDERS'
export const SET_ERROR = 'orders/SET_ERROR'
export const CLEAR_ERROR = 'orders/CLEAR_ERROR'
export const SET_IS_LOADING = 'orders/SET_IS_LOADING'

const initialState = {
    orders: [],
    isLoading: false,
    error: null
}

export const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        case FETCH_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
        case ADD_ORDER: {
            const newOrder = new Order(
                action.payload.id,
                action.payload.items,
                action.payload.amount,
                action.payload.date
            )
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }
        }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const addOrder = (id, cartItems, totalAmount, date) => ({type: ADD_ORDER, payload: {id, items: cartItems, amount: totalAmount, date}})
export const fetchOrders= (loadedOrders) => ({type: FETCH_ORDERS, orders: loadedOrders})
export const setIsLoading = (isLoading) => ({type: SET_IS_LOADING, payload: {isLoading}})
export const setError = (error) => ({type: SET_ERROR, payload: {error}})
export const clearError = () => ({type: CLEAR_ERROR})

export const addOrderThunk = (cartItems, totalAmount) => async (dispatch, getState) => {
    const date = new Date()
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const id = getState().auth.userId
        const token = getState().auth.token
        const res = await fetch(`https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/${id}.json?auth=${token}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        })
        const resData = await res.json()
        dispatch(addOrder(resData.name, cartItems, totalAmount, date))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const fetchOrdersThunk = () => async (dispatch, getState) => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const id = getState().auth.userId
        const res = await fetch(`https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`)
        const resData = await res.json()
        const loadedOrders = []
        for(const key in resData) {
            loadedOrders.push(new Order(key, resData[key].cartItems, resData[key].totalAmount, new Date(resData[key].date)))
        }
        dispatch(fetchOrders(loadedOrders))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}