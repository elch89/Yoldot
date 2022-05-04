import React from 'react';
import {
    Image,
    Dimensions,
    Linking, 
    TouchableOpacity
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const scaling = 728/SCREEN_WIDTH;
/** Link to website course */
const Footer = ()=>{
    return <TouchableOpacity
                onPress={()=>Linking.openURL('http://www.leidaraka.co.il/%D7%A7%D7%95%D7%A8%D7%A1-%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%9C%D7%99%D7%93%D7%94/')}>
        <Image 
        style={{
            height: 90/scaling,
            width: 728/scaling,
          }}
        resizeMode='cover'  
        source={require('../../assets/img/courseLogo.jpg')} /></TouchableOpacity>;
};

export default Footer;