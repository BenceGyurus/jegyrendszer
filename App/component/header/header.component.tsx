import { View, useColorScheme, Image } from "react-native"
import React from 'react';
import HeaderStyle from "./headerStyle";

const Header = ()=>{
    const isDarkMode = useColorScheme() === 'dark';

    return <View style = {isDarkMode ? HeaderStyle.headerDark : HeaderStyle.headerLight}>
        <Image style = {HeaderStyle.headerLogo} source={require('../../media/logo.png')} />
    </View>
}

export default Header;