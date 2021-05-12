import AsyncStorage from '@react-native-async-storage/async-storage';

export const SIGN_UP = 'auth/SIGN_UP'
export const LOG_IN = 'auth/LOG_IN'
export const LOG_OUT = 'auth/LOG_OUT'
export const DID_TRY_AUTH = 'auth/DID_TRY_AUTH'
export const SET_ERROR = 'auth/SET_ERROR'
export const CLEAR_ERROR = 'auth/CLEAR_ERROR'
export const SET_IS_LOADING = 'auth/SET_IS_LOADING'

const initialState = {
    isAuth: false,
    didTryAuth: false,
    token: null,
    userId: null,
    isLoading: false,
    error: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case DID_TRY_AUTH:
            return {
                ...state,
                didTryAuth: true
            }
        case SIGN_UP:
            return {
                ...state,
                isAuth: true,
                userId: action.payload.userId,
                token: action.payload.token
            }
        case LOG_IN:
            return {
                ...state,
                isAuth: true,
                userId: action.payload.userId,
                token: action.payload.token
            }
        case LOG_OUT:
            return {
                ...state,
                isAuth: false,
                userId: null,
                token: null
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
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

export const signUp = (userId, token) => ({type: SIGN_UP, payload: {userId, token}})
export const logIn = (userId, token) => ({type: LOG_IN, payload: {userId, token}})
export const logOut = () => ({type: LOG_OUT})
export const setIsLoading = (isLoading) => ({type: SET_IS_LOADING, payload: {isLoading}})
export const setError = (error) => ({type: SET_ERROR, payload: {error}})
export const clearError = () => ({type: CLEAR_ERROR})
export const didTryAuth = () => ({type: DID_TRY_AUTH})

const saveDataToStorage = (userId, token, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        userId: userId,
        token: token,
        expirationDate: expirationDate.toISOString()
    }))
}

let timer

export const setLogoutTimer = (expTime) => dispatch => {
    timer = setTimeout(() => {
        dispatch(logOutThunk())
    }, expTime)
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer)
    }
}

export const signUpThunk = (email, password) => async dispatch => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBevw-Tmr9PaPnoZT-GbJ7wedL5kBTTNUg', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if (!res.ok) {
            const errorResData = await res.json()
            const errorId = errorResData.error.errors[0].message
            let message = 'Something went wrong'
            if (errorId === 'EMAIL_EXISTS') {
                message = 'Email exists already'
            }
            throw new Error(message)
        }

        const resData = await res.json()
        dispatch(signUp(resData.localId, resData.idToken))
    } catch (e) {
        dispatch(setError(e.toString().split(': ')[1]))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const logInThunk = (email, password) => async dispatch => {
    dispatch(clearError())
    dispatch(setIsLoading(true))
    try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBevw-Tmr9PaPnoZT-GbJ7wedL5kBTTNUg', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if (!res.ok) {
            const errorResData = await res.json()
            const errorId = errorResData.error.errors[0].message
            let message = 'Something went wrong'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'Email could not be found'
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'Password is not valid'
            }
            throw new Error(message)
        }

        const resData = await res.json()
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.localId, resData.idToken, expirationDate)

        dispatch(setLogoutTimer(expirationDate))
        dispatch(logIn(resData.localId, resData.idToken))
    } catch (e) {
        dispatch(setError(e.toString().split(': ')[1]))
        console.log(e)
    } finally {
        dispatch(setIsLoading(false))
    }
}

export const logOutThunk = () => dispatch => {
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
    dispatch(logOut())
}