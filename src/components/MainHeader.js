import React, { useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground
} from 'react-native';
import { Icon,IconButton ,HStack, Heading , NativeBaseProvider, Box, Center, Text } from 'native-base';
import { CommonActions ,StackActions} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import myColors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogOutBtn =(props)=>(
    <IconButton icon={<Icon size="xl" as={Entypo} name="log-out" style={{color:myColors.red,}} />}
        onPress={() => {
            Alert.alert(
                'התנתקות',
                'האם את בטוחה שאת רוצה להתנתק?',
                [
                  { text: "ביטול", style: 'cancel', onPress: () => {} },
                  {
                    text: 'אישור',
                    style: 'destructive',
                    onPress: () =>{
                        props.logState();
                        const resetAction = CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                        props.navigation.dispatch(resetAction)
                    },
                  },
                ]
              );
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
        <ImageBackground
        source={require('../../assets/img/yoldot_logo.png')}
        resizeMode="contain"
        imageStyle={{
            opacity:0.4,}}
        style={{
            flex: 1,
          }}>
        <Center bg="transparent" px="1" pt="1" flex={1}>
              <HStack  bg="transparent" direction={"row"} >
                <Box flex={1} alignItems="flex-start" justifyContent="flex-end"  >
                    <Heading color={myColors.red} size="md">שלום, {name}</Heading>
                </Box>
                <Center>
                    <LogOutBtn {...props} />
                </Center>
            </HStack>
        </Center>
        </ImageBackground>
    </NativeBaseProvider>
)};
export default MainHeader;
