import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Icon,IconButton ,HStack, Heading , NativeBaseProvider, VStack, Center, Text } from 'native-base';
import { CommonActions ,StackActions} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import myColors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ImageHeader = () => (
    <View
        style={{ 
            flexDirection: 'row' ,backgroundColor:'transparent',
            flex: 1, alignItems: "center", justifyContent: "center",
        }}
    > 
      <Image
        style={{
            width: 200/1.5,
            height: 90/1.5,
            // marginLeft: 15,
            backgroundColor:'transparent'
          }}
        
        source={require('../../assets/img/yoldot_logo.png')}
      />
    </View>
);
const LogOutBtn =(props)=>(
    <IconButton size={"md"} icon={<Icon as={Entypo} name="log-out" style={{color:myColors.red,}} />}
        onPress={() => {
            props.logState();
            const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
                });
            props.navigation.dispatch(resetAction)
        }}>
    </IconButton>
                
);
const MainHeader = (props) =>{
    const [name,setName] = useState(null);
    const setHeaderTitle = async () =>{
        AsyncStorage.getItem('user_name').then((name)=>{
            if(name===null){// name could be null on cache reset!!
                setName('guest')
            }
            else
                setName(name);
          } );
    };
    
    useEffect(()=>{
        setHeaderTitle();
    },[]);
    return(
    <NativeBaseProvider>
        <Center bg={myColors.lightBlue} px="1" pt="1">
            {/* <StatusBar barStyle="default" /> */}
            {/* <Box safeAreaTop /> */}
            <HStack space={5} justifyContent="center" bg="#ffffffff" direction={"row"}>
                <Center flex={1} paddingY={10}>
                    <ImageHeader {...props}/>
                </Center>
                <Center w="30%" >
                <VStack  space={0.5} alignItems="center">
                    <Heading color={myColors.red} size="sm">שלום</Heading>
                    <Text color={myColors.red}  bold  isTruncated fontSize="lg">{name}</Text>
                </VStack>
                </Center>
                <Center flex={1}>
                    <LogOutBtn {...props}/>
                </Center>
            </HStack>
        </Center>
    </NativeBaseProvider>
)};
export default MainHeader;
