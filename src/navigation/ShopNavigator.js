import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {ProductsOverviewScreen} from "../screens/shop/ProductsOverviewScreen";
import {enableScreens} from "react-native-screens";
import {Platform} from "react-native";
import {THEME} from "../theme";
import {ProductDetailScreen} from "../screens/shop/ProductDetailScreen";
import {CartScreen} from "../screens/shop/CartScreen";
import {OrdersScreen} from "../screens/shop/OrdersScreen";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import {Ionicons} from "@expo/vector-icons";
import {UserProductsScreen} from "../screens/user/UserProductsScreen";
import {EditProductScreen} from "../screens/user/EditProductScreen";
import {AuthScreen} from "../screens/user/AuthScreen";
import {useDispatch, useSelector} from "react-redux";
import {StartupScreen} from "../screens/user/StartupScreen";
import {logOutThunk} from "../redux/authReducer";

const headerStylesheet = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? THEME.PRIMARY_COLOR : '#fff'
    },
    headerTintColor: Platform.OS === 'android' ? '#fff' : THEME.PRIMARY_COLOR,
    headerTitleStyle: {
        fontFamily: 'robotoBold'
    }
}

const drawerNavigatorProperties = {
    backgroundColor: Platform.OS === 'android' ? THEME.PRIMARY_COLOR : "#fff"
}

const drawerNavigatorContentProperties = {
    activeTintColor: Platform.OS === 'android' ? "#fff" : THEME.PRIMARY_COLOR,
    labelStyle: {
        fontFamily: 'robotoBold',
        fontSize: 20
    },
    inactiveTintColor: Platform.OS === 'android' ? "lightgray" : "darkgray"
}

enableScreens()
const ProductsStack = createStackNavigator()

const ProductsNavigator = () => {
    return(
        <ProductsStack.Navigator screenOptions={headerStylesheet}>
            <ProductsStack.Screen name={'Overview'} component={ProductsOverviewScreen} />
            <ProductsStack.Screen name={'Details'} component={ProductDetailScreen} />
            <ProductsStack.Screen name={'Cart'} component={CartScreen} />
        </ProductsStack.Navigator>
    )
}

const OrdersStack = createStackNavigator()

const OrderNavigator = () => {
    return(
        <OrdersStack.Navigator screenOptions={headerStylesheet}>
            <OrdersStack.Screen name={'Orders'} component={OrdersScreen} />
        </OrdersStack.Navigator>
    )
}

const UserProductsStack = createStackNavigator()

const UserProductsNavigator = () => {
    return(
        <UserProductsStack.Navigator screenOptions={headerStylesheet}>
            <UserProductsStack.Screen name={'User Products'} component={UserProductsScreen} />
            <UserProductsStack.Screen name={'Edit Product'} component={EditProductScreen} />
        </UserProductsStack.Navigator>
    )
}

const StartStack = createStackNavigator()

const StartNavigator = () => {
    return(
        <StartStack.Navigator screenOptions={{headerShown: false}}>
            <StartStack.Screen name={'Start'} component={StartupScreen} />
        </StartStack.Navigator>
    )
}

const AuthStack = createStackNavigator()

const AuthNavigator = () => {
    return(
        <AuthStack.Navigator screenOptions={headerStylesheet}>
            <AuthStack.Screen name={'Login'} component={AuthScreen} />
        </AuthStack.Navigator>
    )
}

const Draw = createDrawerNavigator()

const CustomDrawerContent = (props) => {
    const dispatch = useDispatch()
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem {...drawerNavigatorContentProperties} label={'Logout'} onPress={() => dispatch(logOutThunk())}
                        icon={({color}) =>
                            <Ionicons name={Platform.OS === 'android'
                                ? 'md-log-out'
                                : 'ios-log-out'} size={23} color={color}/>} />
        </DrawerContentScrollView>
    );
}

const ProductsDrawerNavigator = () => {
    return(
        <Draw.Navigator drawerStyle={drawerNavigatorProperties}
                        drawerContent={(props) => <CustomDrawerContent {...props} />}
                        drawerContentOptions={drawerNavigatorContentProperties}>
            <Draw.Screen name={'Products'} component={ProductsNavigator}
                         options={{drawerLabel: 'All Products', drawerIcon: ({color}) => <Ionicons name={Platform.OS === 'android'
                                 ? 'md-list'
                                 : 'ios-list'} size={23} color={color}/>}} />
            <Draw.Screen name={'Order'} component={OrderNavigator} options={{drawerLabel: 'Your Orders', drawerIcon: ({color}) => <Ionicons name={Platform.OS === 'android'
                    ? 'md-cart'
                    : 'ios-cart'} size={23} color={color}/>}}/>
            <Draw.Screen name={'UserProducts'} component={UserProductsNavigator} options={{drawerLabel: 'Your Products', drawerIcon: ({color}) => <Ionicons name={Platform.OS === 'android'
                    ? 'md-man'
                    : 'ios-man'} size={23} color={color}/>}}/>
        </Draw.Navigator>
    )
}

export const ShopNavigator = () => {
    const isAuth = useSelector(state => state.auth.isAuth)
    const didTryAuth = useSelector(state => state.auth.didTryAuth)
    return(
        <NavigationContainer>
            {isAuth && <ProductsDrawerNavigator/>}
            {!isAuth && !didTryAuth && <StartNavigator />}
            {!isAuth && didTryAuth && <AuthNavigator />}
        </NavigationContainer>
    )
}