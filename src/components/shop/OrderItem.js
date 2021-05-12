import React, {useState} from 'react';
import {StyleSheet, View} from "react-native";
import {MediumCustomText} from "../ui/MediumCustomText";
import {CustomButton} from "../ui/CustomButton";
import {BoldCustomText} from "../ui/BoldCustomText";
import {CartItem} from "./CartItem";
import {Card} from "../ui/Card";

export const OrderItem = ({amount, date, items}) => {
    const [showDetails, setShowDetails] = useState(false)
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <BoldCustomText style={styles.totalAmount}>
                    ${amount.toFixed(2)}
                </BoldCustomText>
                <MediumCustomText style={styles.date}>
                    {date}
                </MediumCustomText>
            </View>
            <CustomButton onPress={() => {
                setShowDetails(prevShowDetails => !prevShowDetails)
            }}>
                {!showDetails ? 'Show Details' : 'Hide Details'}
            </CustomButton>
            {showDetails &&
            <View style={{width: '100%'}}>
                {items.map(i => <CartItem deletable={false} amount={i.productPrice} title={i.productTitle} quantity={i.quantity} key={i.productId}/>)}
            </View>}
        </Card>
    )
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontSize: 16
    },
    date: {
        fontSize: 16,
        color: '#888'
    }
})