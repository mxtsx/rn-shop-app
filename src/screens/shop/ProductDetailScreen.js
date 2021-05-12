import React, {useLayoutEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {CustomButton} from "../../components/ui/CustomButton";
import {MediumCustomText} from "../../components/ui/MediumCustomText";
import {addToCart} from "../../redux/cartReducer";

export const ProductDetailScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const {id} = useRoute().params
    const products = useSelector(state => state.products.availableProducts)
    const currentProduct = products.find(p => p.id === id)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: currentProduct.title
        })
    }, [navigation, currentProduct])

    const onPressHandler = () => {
        dispatch(addToCart(currentProduct))
    }

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: currentProduct.imageUrl}} />
            <View style={styles.buttonContainer}>
                <CustomButton style={styles.button} onPress={onPressHandler}>Add to Cart</CustomButton>
            </View>
            <MediumCustomText style={styles.price}>${currentProduct.price.toFixed(2)}</MediumCustomText>
            <MediumCustomText style={styles.description}>{currentProduct.description}</MediumCustomText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 250
    },
    buttonContainer: {
        marginVertical: 10,
        alignItems: 'center'
    },
    button: {
        width: '40%'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 20
    }
})