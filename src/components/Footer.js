import React from 'react';
import {
    Image,
    Dimensions,
    Linking, 
    TouchableOpacity
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
/** Link to website course */
const Footer = ()=>{
    return <TouchableOpacity style={{minHeight:180/(720/SCREEN_WIDTH)}}
                onPress={()=>Linking.openURL('http://www.leidaraka.co.il/%D7%A7%D7%95%D7%A8%D7%A1-%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%9C%D7%99%D7%93%D7%94/')}>
        <Image 
        style={{
            height: 180/(720/SCREEN_WIDTH),
            width: SCREEN_WIDTH,
          }}
        resizeMode='cover'  
        source={require('../../assets/img/courseLogoR.png')} /></TouchableOpacity>;
};

export default Footer;