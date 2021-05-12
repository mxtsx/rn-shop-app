import React, {useCallback, useLayoutEffect, useReducer} from 'react';
import {Alert, Platform, ScrollView, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/ui/CustomHeaderButton";
import {useDispatch, useSelector} from "react-redux";
import {createProductThunk, updateProductThunk} from "../../redux/productsReducer";
import {Input} from "../../components/ui/Input";

const REDUCER_UPDATE = 'form/UPDATE'

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

export const EditProductScreen = () => {
    const navigation = useNavigation()
    const dispatchRedux = useDispatch()
    const error = useSelector(state => state.products.error)
    const id = useRoute().params?.id
    const currentProduct = useSelector(state => state.products.userProducts).find(p => p.id === id)

    const [formState, dispatch] = useReducer(formReducer, {
        inputValues: {
            title: id ? currentProduct.title : '',
            imageUrl: id ? currentProduct.imageUrl : '',
            price: id ? currentProduct.price.toString() : '',
            description: id ? currentProduct.description : ''
        },
        inputValidities: {
            title: !!currentProduct,
            imageUrl: !!currentProduct,
            price: !!currentProduct,
            description: !!currentProduct,
        },
        formIsValid: !!currentProduct
    })

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form', [{text: 'Okay'}])
            return
        }

        id ? dispatchRedux(updateProductThunk(id, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl))
            : dispatchRedux(createProductThunk(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price))
        !error ? navigation.navigate('User Products')
            : Alert.alert(error, 'Please try again', [{text: 'Ok'}])
    }, [formState, id, dispatchRedux, error])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: id ? `Edit ${currentProduct.title}` : 'Create a Product',
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Create a Product'} iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} onPress={submitHandler} />
                </HeaderButtons>
            )
        })
    }, [navigation, currentProduct, formState.inputValues.imageUrl, formState.inputValues.title, formState.inputValues.price, formState.inputValues.description])

    const inputChangedHandler = useCallback((inputId, inputValue, inputValidity) => {
        dispatch({type: REDUCER_UPDATE, value: inputValue, isValid: inputValidity, input: inputId})
    }, [dispatch])

    return (
        <ScrollView>
            <View style={styles.form}>
                <Input label={'Title'}
                       id={'title'}
                       errorText={'Enter a valid input!'}
                       autoCorrect
                       onInputChange={inputChangedHandler}
                       initialValue={currentProduct ? currentProduct.title : ''}
                       initiallyValid={!!currentProduct}
                       keyboardType={'default'}
                       returnKeyType={'next'}
                       required
                       autoCorrent={false}/>
                <Input label={'Image Url'}
                       id={'imageUrl'}
                       errorText={'Enter a valid Url!'}
                       keyboardType={'default'}
                       onInputChange={inputChangedHandler}
                       initialValue={currentProduct ? currentProduct.imageUrl : ''}
                       initiallyValid={!!currentProduct}
                       returnKeyType={'next'}
                       required
                       autoCorrent={false}/>
                {!id && <Input label={'Price'}
                               id={'price'}
                               errorText={'Enter a valid price!'}
                               keyboardType={'decimal-pad'}
                               onInputChange={inputChangedHandler}
                               initialValue={currentProduct ? currentProduct.price : ''}
                               initiallyValid={!!currentProduct}
                               required
                               autoCorrent={false}
                               min={0}
                               returnKeyType={'next'}/>}
                <Input label={'Description'}
                       id={'description'}
                       errorText={'Enter a valid description!'}
                       keyboardType={'default'}
                       onInputChange={inputChangedHandler}
                       initialValue={currentProduct ? currentProduct.description : ''}
                       initiallyValid={!!currentProduct}
                       multiline
                       required
                       autoCorrent={false}
                       numberOfLines={3}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    }
})