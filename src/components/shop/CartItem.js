import React from 'react';
import {Platform, StyleSheet, View} from "react-native";
import {MediumCustomText} from "../ui/MediumCustomText";
import {TouchableArea} from "../ui/TouchableArea";
import {Ionicons} from "@expo/vector-icons";
import {BoldCustomText} from "../ui/BoldCustomText";

export const CartItem = ({quantity, title, amount, onRemove, deletable}) => {
    return (
        <View style={styles.cartItem}>
            <MediumCustomText style={styles.itemData}>
                <MediumCustomText style={styles.quantity}>{quantity} </MediumCustomText>
                <BoldCustomText style={styles.title}>
                    {title}
                </BoldCustomText>
            </MediumCustomText>
            <View style={styles.itemData}>
                <BoldCustomText style={styles.amount}>{amount?.toFixed(2)} </BoldCustomText>
                {deletable &&
                <TouchableArea onPress={onRemove} style={styles.deleteButton}>
                    <Ionicons name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} size={23} color={'#ff0000'}/>
                </TouchableArea>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        color: '#888',
        fontSize: 16
    },
    title: {
        fontSize: 16
    },
    amount: {
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20
    }
})