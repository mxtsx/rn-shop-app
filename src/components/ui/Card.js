import React from 'react';
import {StyleSheet, View} from "react-native";

export const Card = ({children, style}) => {
    return (
        <View style={{...styles.card, ...style}}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: '#fff'
    }
})