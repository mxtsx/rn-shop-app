import React from 'react';
import {BoldCustomText} from "./BoldCustomText";
import {CustomButton} from "./CustomButton";
import {fetchProductThunk} from "../../redux/productsReducer";
import {StyleSheet, View} from "react-native";

export const ErrorOccurred = ({text, action}) => {
    return (
        <View style={styles.container}>
            <BoldCustomText style={styles.text}>{text}</BoldCustomText>
            <CustomButton onPress={action}>Try again</CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    text: {
        fontSize: 20,
        marginVertical: 10
    }
})