import {CartItem} from "../models/cart-item";
import {ADD_ORDER} from "./ordersReducer";
import {DELETE_PRODUCT} from "./productsReducer";

const ADD_TO_CART = 'cart/ADD_TO_CART'
const REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART'

const initialState = {
    items: {},
    totalAmount: 0
}

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.payload.product
            const productPrice = addedProduct.price
            const productTitle = addedProduct.title
            let updatedOrNewCartItem
            if(state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                )
            } else {
                updatedOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice)
            }
            return {
                ...state,
                items: {...state.items, [addedProduct.id]: updatedOrNewCartItem},
                totalAmount: state.totalAmount + productPrice
            }
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.payload.productId]
            const currentQuantity = selectedCartItem.quantity
            let updatedCartItems
            if(currentQuantity > 1) {
                const updatedCartItem = new CartItem(
                    currentQuantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice)
                updatedCartItems = {...state.items, [action.payload.productId]: updatedCartItem}
            } else {
                updatedCartItems = {...state.items}
                delete updatedCartItems[action.payload.productId]
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        case ADD_ORDER:
            return initialState
        case DELETE_PRODUCT:
            if(!state.items[action.payload.id]){
                return state
            }
            const updatedItems = {...state.items}
            const itemTotal = state.items[action.payload.id].sum
            delete updatedItems[action.payload.id]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
        default:
            return state
    }
}

export const addToCart = (product) => ({type: ADD_TO_CART, payload: {product}})
export const removeFromCart = (productId) => ({type: REMOVE_FROM_CART, payload: {productId}})