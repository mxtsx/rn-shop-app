import {Product} from "../models/products";
import {registerForPushNotificationsAsync} from "../notifications/notifications";

export const DELETE_PRODUCT = 'products/DELETE_PRODUCT'
export const CREATE_PRODUCT = 'products/CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'products/UPDATE_PRODUCT'
export const FETCH_PRODUCT = 'products/FETCH_PRODUCT'
export const SET_IS_LOADING = 'products/SET_IS_LOADING'
export const SET_ERROR = 'products/SET_ERROR'
export const CLEAR_ERROR = 'products/CLEAR_ERROR'

const initialState = {
    availableProducts: [],
    userProducts: [],
    isLoading: false,
    error: null
}

export const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        case FETCH_PRODUCT:
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(p => p.id !== action.payload.id),
                availableProducts: state.availableProducts.filter(p => p.id !== action.payload.id)
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(action.id, action.payload.ownerId, action.payload.pushToken, action.payload.title, action.payload.imageUrl,action.payload.description,action.payload.price)
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const currentPost = state.userProducts.find(p => p.id === action.payload.id)
            const updatedProduct = new Product(
                action.payload.id,
                currentPost.ownerId,
                currentPost.pushToken,
                action.payload.title,
                action.payload.imageUrl,
                action.payload.description,
                currentPost.price
            )
            const elementFindAndUpdate = arr => {
                return arr.map(p => {
                    if (p.id === updatedProduct.id) {
                        for(let key in updatedProduct) {
                            p[key] = updatedProduct[key]
                        }
                    }
                    return p
                })
            }
            return {
                ...state,
                availableProducts: elementFindAndUpdate(state.availableProducts),
                userProducts: elementFindAndUpdate(state.userProducts)
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

export const deleteProduct = (id) => ({type: DELETE_PRODUCT, payload: {id}})
export const createProduct = (id, title, description, imageUrl, price, ownerId, pushToken) => ({type: CREATE_PRODUCT, payload: {id, title, description, price, imageUrl, ownerId, pushToken}})
export const updateProduct = (id, title, description, imageUrl) => ({type: UPDATE_PRODUCT, payload: {id, title, description, imageUrl}})
export const fetchProduct = (loadedProducts, loadedUserProducts) => ({type: FETCH_PRODUCT, products: loadedProducts, userProducts: loadedUserProducts})
export const setIsLoading = (isLoading) => ({type: SET_IS_LOADING, payload: {isLoading}})
export const setError = (error) => ({type: SET_ERROR, payload: {error}})
export const clearError = () => ({type: CLEAR_ERROR})

export const createProductThunk = (title, description, imageUrl, price) => async (dispatch, getState) => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const pushToken = await registerForPushNotificationsAsync()
        const id = getState().auth.userId
        const token = getState().auth.token
        const res = await fetch(`https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: id,
                ownerPushToken: pushToken
            })
        })
        const resData = await res.json()
        dispatch(createProduct(resData.name, title, description, imageUrl, price, id, pushToken))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const updateProductThunk = (id, title, description, imageUrl) => async (dispatch, getState) => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const token = getState().auth.token
        const res = await fetch(`https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        })

        if(!res.ok) {
            throw new Error('Something goes wrong')
        }

        dispatch(updateProduct(id, title, description, imageUrl))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const deleteProductThunk = (id) => async (dispatch, getState) => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const token = getState().auth.token
        await fetch(`https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`, {
            method: 'DELETE'
        })
        dispatch(deleteProduct(id))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const fetchProductThunk = () => async (dispatch, getState) => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const id = getState().auth.userId
        const res = await fetch('https://rn-shop-app-21344-default-rtdb.europe-west1.firebasedatabase.app/products.json')
        const resData = await res.json()
        const loadedProducts = []
        for(const key in resData) {
            loadedProducts.push(new Product(key, resData[key].ownerId, resData[key].ownerPushToken, resData[key].title, resData[key].imageUrl, resData[key].description, resData[key].price))
        }
        const loadedUserProducts = loadedProducts?.filter(p => p.ownerId === id)
        dispatch(fetchProduct(loadedProducts, loadedUserProducts))
    } catch (e) {
        dispatch(setError('Something goes wrong'))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}
