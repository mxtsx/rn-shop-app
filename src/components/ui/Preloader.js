import React from 'react';
import {ActivityIndicator, StyleSheet, View} from "react-native";

export const Preloader = ({style, children, ...props}) => {
    return (
        <View style={{...styles.preloader, ...style}}>
            {children}
            <ActivityIndicator {...props}/>
        </View>
    );
};

const styles = StyleSheet.create({
    preloader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})