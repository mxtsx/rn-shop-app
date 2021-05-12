import React, {useCallback, useEffect, useLayoutEffect, useReducer, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Card} from "../../components/ui/Card";
import {Input} from "../../components/ui/Input";
import {CustomButton} from "../../components/ui/CustomButton";
import {THEME} from "../../theme";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {logInThunk, signUpThunk} from "../../redux/authReducer";

const REDUCER_UPDATE = 'form/REDUCER_UPDATE'

const formReducer = (state, action) => {
    switch (action.type) {
        case REDUCER_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            }
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            }
            let updatedFormIsValid = true
            for(const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
            }
            return {
                ...state,
                formIsValid: updatedFormIsValid,
                inputValues: updatedValues,
                inputValidities: updatedValidities
            }
        default:
            return state
    }
}

export const AuthScreen = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const isLoading = useSelector(state => state.auth.isLoading)
    const error = useSelector(state => state.auth.error)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [formState, authDispatch] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })

    useEffect(() => {
        if(error) {
            Alert.alert('Error', error, [{text: 'Okay'}])
        }
    }, [error])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Login'
        })
    }, [navigation])

    const signUpHandler = () => {
        if(isSignUp) {
            dispatch(signUpThunk(formState.inputValues.email, formState.inputValues.password))
        } else {
            dispatch(logInThunk(formState.inputValues.email, formState.inputValues.password))
        }
    }

    const inputChangeHandler = useCallback((inputId, inputValue, inputValidity) => {
        authDispatch({
            type: REDUCER_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputId
        })
    }, [authDispatch])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={'padding'}
                                  keyboardVerticalOffset={-110}
                                  style={styles.contentWrapper}>
                    <Card style={styles.authContainer}>
                        <ScrollView>
                            <Input id={'email'}
                                   label={'E-Mail'}
                                   keyboardType={'email-address'}
                                   required
                                   email
                                   autoCapitalize={'none'}
                                   onInputChange={inputChangeHandler}
                                   initialValue={''}
                                   errorText={'Please enter a valid email'}/>
                            <Input id={'password'}
                                   label={'Password'}
                                   keyboardType={'default'}
                                   secureTextEntry
                                   required
                                   minLength={5}
                                   autoCapitalize={'none'}
                                   onInputChange={inputChangeHandler}
                                   initialValue={''}
                                   errorText={'Please enter a valid password'}/>
                        </ScrollView>
                        <View style={styles.buttons}>
                            <View style={styles.buttonContainer}>
                                {!isLoading ?
                                    <CustomButton style={styles.button}
                                                  disabled={!formState.formIsValid}
                                                  color={!formState.formIsValid ? '#ccc' : THEME.PRIMARY_COLOR}
                                                  onPress={signUpHandler}>
                                        {isSignUp ? 'Sign Up' : 'Login'}
                                    </CustomButton>
                                    : <ActivityIndicator size={'small'} color={THEME.PRIMARY_COLOR}/>}
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomButton style={styles.button} color={THEME.ACCENT_COLOR} onPress={() => {
                                    setIsSignUp(prevState => !prevState)
                                }}>{`Switch to ${isSignUp ? 'Login' : 'SignUp'}`}</CustomButton>
                            </View>
                        </View>
                    </Card>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentWrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 15
    },
    buttons: {
        marginTop: 15
    },
    buttonContainer: {
        marginVertical: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '45%'
    }
})