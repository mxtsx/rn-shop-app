import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {MediumCustomText} from "../../components/ui/MediumCustomText";
import {BoldCustomText} from "../../components/ui/BoldCustomText";
import {CustomButton} from "../../components/ui/CustomButton";
import {useDispatch, useSelector} from "react-redux";
import {THEME} from "../../theme";
import {CartItem} from "../../components/shop/CartItem";
import {removeFromCart} from "../../redux/cartReducer";
import {addOrderThunk} from "../../redux/ordersReducer";
import {Card} from "../../components/ui/Card";
import {ErrorOccurred} from "../../components/ui/ErrorOccurred";
import {fetchProductThunk} from "../../redux/productsReducer";
import {Preloader} from "../../components/ui/Preloader";

export const CartScreen = () => {
    const dispatch = useDispatch()
    const error = useSelector(state => state.products.error)
    const isLoading = useSelector(state => state.products.isLoading)
    const cartTotalAmount = useSelector(state => state.cart.totalAmount)
    const cartItems = useSelector(state => {
        const transformedCartItems = []
        for(const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum,
                pushToken: state.cart.items[key].pushToken
            })
        }
        return transformedCartItems.sort((a, b) => a - b)
    })

    if(error) {
        return <ErrorOccurred action={() => dispatch(fetchProductThunk())} text={error}/>
    }

    if(isLoading) {
        return <Preloader size={'large'} color={'#ccc'}/>
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <MediumCustomText style={styles.summaryText}>Total: <BoldCustomText style={styles.amountText}>
                        ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
                    </BoldCustomText>
                </MediumCustomText>
                <CustomButton color={!cartItems.length ? '#ccc' : THEME.ACCENT_COLOR}
                              onPress={() => {
                                  dispatch(addOrderThunk(cartItems, cartTotalAmount))
                              }}
                              disabled={!cartItems.length}>
                    Order Now
                </CustomButton>
            </Card>
            <FlatList data={cartItems} keyExtractor={item => item.productId}
                      renderItem={itemData => <CartItem deletable={true} title={itemData.item.productTitle} quantity={itemData.item.quantity} amount={itemData.item.sum} onRemove={() => dispatch(removeFromCart(itemData.item.productId))} />} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
        padding: 10
    },
    summaryText: {
        fontSize: 18
    },
    amountText: {
        color: THEME.PRIMARY_COLOR
    }
})