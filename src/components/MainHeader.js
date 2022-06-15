import React, { useEffect, useState } from 'react';
import {
    Alert,
    ImageBackground
} from 'react-native';
import { Icon,IconButton ,HStack, Heading , Box, Center, AlertDialog, Button } from 'native-base';
import { CommonActions ,StackActions} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import myColors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogOutBtn =(props)=>{
    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => setIsOpen(false);
    const logOut = () =>{
        props.logState();
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        props.navigation.dispatch(resetAction)
    }
    const cancelRef = React.useRef(null);
    return (<>
    <IconButton icon={<Icon size="xl" as={Entypo} name="log-out" style={{color:myColors.red,}} />}
        onPress={() => {setIsOpen(!isOpen)
            // Alert.alert(
            //     'התנתקות',
            //     'האם את בטוחה שאת רוצה להתנתק?',
            //     [
            //       { text: "ביטול", style: 'cancel', onPress: () => {} },
            //       {
            //         text: 'אישור',
            //         style: 'destructive',
            //         onPress: () =>{
            //             props.logState();
            //             const resetAction = CommonActions.reset({
            //                 index: 0,
            //                 routes: [{ name: 'Login' }],
            //             });
            //             props.navigation.dispatch(resetAction)
            //         },
            //       },
            //     ]
            //   );
        }}>
    </IconButton>
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
    <>
        <ImageBackground
        source={require('../../assets/img/yoldot_logo.png')}
        resizeMode="contain"
        imageStyle={{
            opacity:0.4,}}
        style={{
            // flex: 1,
            height:60
          }}>
        <Center bg="transparent" px="1" pt="1" flex={1}>
              <HStack  bg="transparent" direction={"row"} >
                <Box flex={1} alignItems="flex-start" justifyContent="center"  >
                    <Heading color={myColors.red} size="md">שלום, {name}</Heading>
                </Box>
                <Center>
                    <LogOutBtn {...props} />
                </Center>
            </HStack>
        </Center>
        </ImageBackground>
    </>
)};
export default MainHeader;
