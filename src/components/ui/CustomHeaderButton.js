import React from 'react';
import {HeaderButton} from "react-navigation-header-buttons";
import {Ionicons} from "@expo/vector-icons";
import {THEME} from "../../theme";
import {Platform} from "react-native";

export const CustomHeaderButton = (props) => {
    return <HeaderButton {...props}
                         IconComponent={Ionicons}
                         iconSize={23}
                         color={Platform.OS === 'android' ? '#fff' : THEME.PRIMARY_COLOR}/>
}