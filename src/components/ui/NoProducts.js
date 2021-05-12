import React from 'react';
import {MediumCustomText} from "./MediumCustomText";
import {StyleSheet, View} from "react-native";

export const NoProducts = () => {
    return (
        <View style={styles.noProduct}>
            <MediumCustomText numberOfLines={2} style={styles.noProductText}>No products found. You can add some product!</MediumCustomText>
        </View>
    );
};

const styles = StyleSheet.create({
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