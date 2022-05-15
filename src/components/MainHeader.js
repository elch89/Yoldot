import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
} from 'react-native';
import { Icon,IconButton ,HStack, Heading , NativeBaseProvider, Box, Center, Text } from 'native-base';
import { CommonActions ,StackActions} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import myColors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ImageHeader = () => (
 
      <Image
        style={{
            resizeMode: 'contain',
            backgroundColor:'transparent',
            opacity:0.2,
            position:'absolute'
          }}
        
        source={require('../../assets/img/yoldot_logo.png')}
      />
    // </View>
);
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
        <Center bg="#ffffff" px="1" pt="1" >
            <ImageHeader {...props}/>
            <HStack  bg="transparent" direction={"row"}>
                <Box flex={1} alignItems="flex-start" justifyContent="flex-end"  >
                {/* <VStack  > */}
                    <Heading color={myColors.red} size="lg">שלום, {name}</Heading>
                {/* </VStack> */}
                </Box>
                <Center >
                    <LogOutBtn {...props} />
                </Center>
            </HStack>
        </Center>
    </NativeBaseProvider>
)};
export default MainHeader;
