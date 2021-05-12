import React from 'react';
import {Platform, TouchableNativeFeedback, TouchableOpacity} from "react-native";

export const TouchableArea = ({children, ...props}) => {
    let TouchableArea = TouchableOpacity
    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableArea = TouchableNativeFeedback
    }
    return (
        <TouchableArea {...props}>
            {children}
        </TouchableArea>
    )
}