import React, {useEffect, useLayoutEffect} from 'react';
import {FlatList} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/ui/CustomHeaderButton";
import {OrderItem} from "../../components/shop/OrderItem";
import {fetchOrdersThunk} from "../../redux/ordersReducer";
import {ErrorOccurred} from "../../components/ui/ErrorOccurred";
import {Preloader} from "../../components/ui/Preloader";

export const OrdersScreen = () => {
    const navigation = useNavigation()
    const error = useSelector(state => state.orders.error)
    const isLoading = useSelector(state => state.orders.isLoading)
    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchOrdersThunk())
    }, [dispatch])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Your orders',
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Toggle'} iconName={'ios-menu'} onPress={ () => navigation.dispatch(DrawerActions.openDrawer())} />
                </HeaderButtons>
            )
        })
    }, [navigation])

    if(error) {
        return <ErrorOccurred action={() => dispatch(fetchOrdersThunk())} text={error}/>
    }

    if(isLoading) {
        return <Preloader size={'large'} color={'#ccc'}/>
    }

    return <FlatList data={orders} renderItem={itemDate => <OrderItem date={itemDate.item.readableDate} amount={itemDate.item.totalAmount} items={itemDate.item.items} />} />
}