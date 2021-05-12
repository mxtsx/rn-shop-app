import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {ProductItem} from "../../components/shop/ProductItem";
import {addToCart} from "../../redux/cartReducer";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/ui/CustomHeaderButton";
import {CustomButton} from "../../components/ui/CustomButton";
import {fetchProductThunk} from "../../redux/productsReducer";
import {Preloader} from "../../components/ui/Preloader";
import {NoProducts} from "../../components/ui/NoProducts";
import {ErrorOccurred} from "../../components/ui/ErrorOccurred";

export const ProductsOverviewScreen = React.memo(() => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const error = useSelector(state => state.products.error)
    const isLoading = useSelector(state => state.products.isLoading)
    const products = useSelector(state => state.products.availableProducts)

    const loadProducts = useCallback( () => {
        dispatch(fetchProductThunk())
    }, [dispatch])

    const refreshProducts = useCallback( async () => {
        setIsRefreshing(true)
        await dispatch(fetchProductThunk())
        setIsRefreshing(false)
    }, [dispatch])

    useEffect(() => {
        navigation.addListener('focus', loadProducts)
        return () => {
            navigation.removeListener('focus', loadProducts)
        }
    }, [loadProducts])

    useEffect( () => {
        loadProducts()
    }, [dispatch])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'All products',
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Cart'}
                          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                          onPress={() => navigation.navigate('Cart')}/>
                </HeaderButtons>
            ),
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Toggle'} iconName={'ios-menu'} onPress={ () => navigation.dispatch(DrawerActions.openDrawer())} />
                </HeaderButtons>
            )
        })
    }, [navigation])

    const onViewHandler = (id) => {
        navigation.navigate('Details', {id: id})
    }

    if(error) {
        return <ErrorOccurred action={() => dispatch(fetchProductThunk())} text={error}/>
    }

    if(isLoading && !isRefreshing) {
        return <Preloader size={'large'} color={'#ccc'}/>
    }

    if(!isLoading && !products.length) {
        return <NoProducts />
    }

    return (
        <FlatList onRefresh={refreshProducts} refreshing={isRefreshing} data={products} renderItem={itemList => <ProductItem title={itemList.item?.title}
                                                                       price={itemList.item?.price}
                                                                       image={itemList.item?.imageUrl}
                                                                       onViewHandler={() => onViewHandler(itemList.item?.id)}>
            <View style={styles.buttons}>
            <CustomButton style={styles.button} onPress={() => onViewHandler(itemList.item.id)}>View Details</CustomButton>
            <CustomButton style={styles.button} onPress={() => dispatch(addToCart(itemList.item))}>To Cart</CustomButton>
        </View></ProductItem>}/>
    )
})

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '15%',
        paddingHorizontal: 20,
    },
    button: {
        width: '40%'
    },
    noProduct: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30
    },
    noProductText: {
        fontSize: 20,
        textAlign: 'center'
    }
})