import {applyMiddleware, combineReducers, createStore} from "redux";
import {productsReducer} from "./productsReducer";
import {cartReducer} from "./cartReducer";
import {ordersReducer} from "./ordersReducer";
import thunk from "redux-thunk";
import {authReducer} from "./authReducer";

const reducers = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer
})

export const store = createStore(reducers, applyMiddleware(thunk))