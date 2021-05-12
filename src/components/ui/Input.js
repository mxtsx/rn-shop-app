import React, {useEffect, useReducer} from 'react';
import {StyleSheet, TextInput, View} from "react-native";
import {BoldCustomText} from "./BoldCustomText";
import {MediumCustomText} from "./MediumCustomText";

const INPUT_CHANGED = 'input/INPUT_CHANGED'
const INPUT_BLUR = 'input/INPUT_BLUR'

const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGED:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
        default:
            return state
    }
}

export const Input = ({id, onInputChange, label, errorText, initialValue, initiallyValid, ...props}) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue ? initialValue : '',
        isValid: initiallyValid,
        touched: false
    })

    useEffect(() => {
        if(inputState.touched){
            onInputChange(id, inputState.value, inputState.isValid)
        }
    }, [inputState, onInputChange, id])

    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        dispatch({type: INPUT_CHANGED, value: text, isValid: isValid})
    }

    const lostFocusHandler = () => {
        dispatch({type: INPUT_BLUR})
    }

    return (
        <View style={styles.formControl}>
            <BoldCustomText style={styles.label}>
                {label}
            </BoldCustomText>
            <TextInput value={inputState.value}
                       onChangeText={textChangeHandler}
                       onBlur={lostFocusHandler}
                       style={styles.input} placeholder={`Your Products ${label}`}
                       {...props}/>
            {!inputState.isValid && inputState.touched &&
            <View style={styles.errorContainer}>
                <MediumCustomText style={styles.errorText}>{errorText}</MediumCustomText>
            </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
    },
    label: {
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 13
    }
})