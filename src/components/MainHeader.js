import React, { useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground,
    TouchableOpacity, View , Text, SafeAreaView
} from 'react-native';
import { Icon,IconButton ,HStack, Heading , Box, Center, AlertDialog, Button } from 'native-base';
import { CommonActions ,StackActions} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import myColors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LoginManager } from 'react-native-fbsdk-next';

const LogOutBtn =(props)=>{
    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => setIsOpen(false);
    const logOut = () =>{
        props.logState();
        // LoginManager.logOut()
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        props.navigation.dispatch(resetAction)
    }
    const cancelRef = React.useRef(null);
    return (<>
    {/* <IconButton icon={<Icon size="xl" as={Entypo} name="log-out" style={{color:myColors.red,}} />}
        onPress={() => {setIsOpen(!isOpen)}}>
    </IconButton> */}
    <TouchableOpacity onPress={()=>setIsOpen(!isOpen)}><View style={{justifyContent:'center',alignContent:'center', flex:1}} >
                        <Text style={{color:myColors.red}}>{'התנתקות'}</Text>
                    </View></TouchableOpacity>
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
    <AlertDialog.Content>
      {/* <AlertDialog.CloseButton /> */}
      {/* <AlertDialog.Header>התנתקות</AlertDialog.Header> */}
      <AlertDialog.Header borderColor={myColors.darkBlue}>{'האם את בטוחה שאת רוצה להתנתק?'}
      </AlertDialog.Header>
      <AlertDialog.Footer borderColor={"transparent"}>
        <Button.Group flex={1}>
            <Button bg ={myColors.red} onPress={logOut}>
            {'אישור'}
            </Button>
            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
            {"ביטול"}
            </Button>
        </Button.Group>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog></>)
};

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
    <SafeAreaView style={{minHeight:120}}>
        <ImageBackground
        source={require('../../assets/img/yoldot_logo.png')}
        resizeMode="contain"
        imageStyle={{
            opacity:0.7,}}
        style={{
            // minHeight:'100%'
            flex:1
          }}>
        <Center bg="transparent" px="1" pt="1" flex={1}>
              <HStack  bg="transparent" direction={"row"} px='4'>
                <Box flex={1} alignItems="flex-start" justifyContent="center"  >
                    <Heading color={myColors.red} size="md">שלום, {name}</Heading>
                </Box>
                <Center>
                    <LogOutBtn {...props} />
                </Center>
            </HStack>
        </Center>
        </ImageBackground>
    </SafeAreaView>
)};
export default MainHeader;
