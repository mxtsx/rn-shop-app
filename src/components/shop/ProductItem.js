import React from 'react';
import {Image, StyleSheet, View} from "react-native";
import {MediumCustomText} from "../ui/MediumCustomText";
import {BoldCustomText} from "../ui/BoldCustomText";
import {TouchableArea} from "../ui/TouchableArea";
import {Card} from "../ui/Card";

export const ProductItem = ({title, price, image, onViewHandler, children}) => {
    return(
            <Card style={styles.product}>
                <TouchableArea activeOpacity={0.8}
                               useForeground
                               onPress={onViewHandler}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{uri: image}}/>
                    </View>
                </TouchableArea>
                <View style={styles.details}>
                    <BoldCustomText style={styles.title}>{title}</BoldCustomText>
                    <MediumCustomText style={styles.price}>${price?.toFixed(2)}</MediumCustomText>
                </View>
                {children}
            </Card>
)
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 15,
        overflow: 'hidden'
    },
    imageContainer: {
        height: '60%',
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%'
    },
    details: {
        alignItems: 'center',
        height: '15%'
    },
    title: {
        fontSize: 18,
        marginVertical: 4,
        marginHorizontal: 4
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginHorizontal: 4
    }
})