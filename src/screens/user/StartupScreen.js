import React, {useEffect} from 'react';
import {Preloader} from "../../components/ui/Preloader";
import {THEME} from "../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch} from "react-redux";
import {didTryAuth, logIn, setLogoutTimer} from "../../redux/authReducer";

export const StartupScreen = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if(!userData) {
                dispatch(didTryAuth())
                return
            }
            const {token, userId, expirationDate} = JSON.parse(userData)
            const expiryDate = new Date(expirationDate)
            if(expiryDate <= new Date() || !token || !userId ) {
                dispatch(didTryAuth())
                return
            }

            const expirationTime = expiryDate.getTime() - new Date().getTime()

            dispatch(setLogoutTimer(expirationTime))
            dispatch(logIn(userId, token))
        }
        tryLogin()
    }, [dispatch])
    return <Preloader size={'large'} color={THEME.PRIMARY_COLOR} />
}