import React, {useState} from 'react';
import {Provider} from "react-redux";
import {store} from "./src/redux/store";
import {ShopNavigator} from "./src/navigation/ShopNavigator";
import AppLoading from "expo-app-loading"
import * as Font from "expo-font"

const fetchFonts = async () => {
    await Font.loadAsync({
        'robotoMed': require('./assets/fonts/RobotoCondensed-Regular.ttf'),
        'robotoBold': require('./assets/fonts/RobotoCondensed-Bold.ttf')
    })
}

export default function App() {
    const [isReady, setIsReady] = useState()

    if(!isReady) {
        return <AppLoading startAsync={fetchFonts}
                           onError={e => console.log(e)}
                           onFinish={() => setIsReady(true)} />
    }

    return (
        <Provider store={store}>
            <ShopNavigator/>
        </Provider>
    )
}
