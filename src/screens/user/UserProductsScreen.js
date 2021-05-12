import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {FlatList, Platform, StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {ProductItem} from "../../components/shop/ProductItem";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/ui/CustomHeaderButton";
import {CustomButton} from "../../components/ui/CustomButton";
import {deleteProductThunk, fetchProductThunk} from "../../redux/productsReducer";
import {Preloader} from "../../components/ui/Preloader";
import {NoProducts} from "../../components/ui/NoProducts";
import {ErrorOccurred} from "../../components/ui/ErrorOccurred";

export const UserProductsScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const error = useSelector(state => state.products.error)
    const isLoading = useSelector(state => state.products.isLoading)
    const products = useSelector(state => state.products.userProducts)

    const loadProducts = useCallback( () => {
        dispatch(fetchProductThunk())
    }, [dispatch])

    useEffect(() => {
        navigation.addListener('focus', loadProducts)
        return () => {
            navigation.removeListener('focus', loadProducts)
        }
    }, [loadProducts])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Your Products',
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Toggle'} iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={ () => navigation.dispatch(DrawerActions.openDrawer())} />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title={'Toggle'} iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'} onPress={ () => navigation.navigate('Edit Product')} />
                </HeaderButtons>
            )
        })
    }, [navigation])
    const editProductHandler = (id) => {
        navigation.navigate('Edit Product', {id: id})
    }

    if(error) {
        return <ErrorOccurred action={() => dispatch(fetchProductThunk())} text={error}/>
    }

    if(isLoading) {
        return <Preloader size={'large'} color={'#ccc'}/>
    }

    if(!isLoading && !products.length) {
        return <NoProducts />
    }

    return <FlatList data={products}
                     renderItem={itemData => <ProductItem title={itemData.item.title} price={itemData.item.price} image={itemData.item.imageUrl} onViewHandler={() => editProductHandler(itemData.item.id)}>
        <View style={styles.buttons}>
            <CustomButton style={styles.button} onPress={() => editProductHandler(itemData.item.id)}>Edit</CustomButton>
            <CustomButton style={styles.button} onPress={() => dispatch(deleteProductThunk(itemData.item.id))}>Delete</CustomButton>
        </View>
    </ProductItem>} />
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '15%',
        paddingHorizontal: 20,
    },
    button: {
        width: '35%'
    }
})