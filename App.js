import React from 'react';
import {NavigationContainer , CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Rating,
    Register,
    Login,
    HomePage,
    Compare,
    Coupons,
    Podcasts,
    Feedback,} from './src/screens/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useFonts } from "@use-expo/font";
import { NativeBaseProvider } from 'native-base';
import MainHeader from './src/components/MainHeader';
import colors from './src/styles/colors';


async function userLogout(){
  try {
      // Remove user token from storage
      await AsyncStorage.removeItem('id_token');
  } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
  }
};
// Define a global text font for all the app
const customFont = { 
  varelaRound: require("./assets/fonts/VarelaRound-Regular.ttf"),
}
// Creatw main navigator using 'react-navigation'
const Stack = createStackNavigator();
function MainNavigator(){
  return(
    <Stack.Navigator
    initialRouteName="initScreen">
        <Stack.Screen
         name='Home'
         component={HomePage}
         options={{
          header:(props)=><MainHeader logState={userLogout} {...props}/>
          }}/>
        <Stack.Screen
         name='Login'
         component={Login}
         options={{header:(props)=>null}}/>
        <Stack.Screen
         name='Register'
         component={Register}
         options={{header:(props)=>null}}/>
        <Stack.Screen
         name='Feedback'
         component={Feedback}
        options={{
          headerStyle:{backgroundColor:colors.darkBlue},
          headerTitle:(props)=>null,
          headerTintColor: '#fff',
          headerBackTitle:'חזרה',
      }}
         />
         <Stack.Screen
         name='Compare'
         component={Compare}
        options={{
          headerStyle:{backgroundColor:colors.darkBlue},
          headerTitle:(props)=>null,
          headerTintColor: '#fff',
          headerBackTitle:'חזרה',
      }}
         />
         <Stack.Screen
         name='Rating'
         component={Rating}
         options={{
          headerTitle:'בתי יולדות - ציון משוקלל',
          headerStyle:{backgroundColor:colors.darkBlue},
          headerTitleStyle:{
            fontSize:24, 
            color:'#fff',
            textAlign:'center',
            fontWeight:'bold',
          },
          headerTintColor: '#fff',
          headerBackTitle:'חזרה',
          }}/>
         <Stack.Screen
         name='initScreen'
         component={InitScreen}
         options={{header:(props)=>null}}/>

    </Stack.Navigator>
  )};
  /* Creates initial screen - choose between login or main screen (logged in) */

function InitScreen (props){
  // search for token - user is logged in
  AsyncStorage.getItem('id_token').then((token)=>{
    // choice of what page to route to
    const mainPage = !!token ? 'Home':'Login';
    // navigate to chosen page - first in stack
    const resetAction = CommonActions.reset({
        index: 0,// first in stack
        routes: [
          {name: mainPage}
        ]
      });
      props.navigation.dispatch(resetAction)
  } );
    
  return (null);

}

const App = () =>{
  
  // the same as Font.loadAsync , the hook returns  true | error 
  const [isLoaded] = useFonts(customFont);
  if (!isLoaded) {
      return <AppLoading />;
  }
  return <NativeBaseProvider><NavigationContainer><MainNavigator/></NavigationContainer></NativeBaseProvider>;
      
};
export default App