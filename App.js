import React,{useEffect, useState} from 'react';
import * as SplashScreen from "expo-splash-screen";
import {NavigationContainer , CommonActions, StackActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Rating,
    Register,
    Login,
    HomePage,
    Compare,
    Coupons,
    Podcasts,
    Feedback,} from './src/screens/index';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
// import useFonts hook  
import { useFonts } from "@use-expo/font";

SplashScreen.preventAutoHideAsync().then(configureBgNav).catch((error) => {    
   console.warn("SplashScreen.preventAutoHideAsync error:", error);
  });
async function configureBgNav(){// sets nav bar color
  try{
    NavigationBar.setVisibilityAsync('hidden');
  }
  catch(e){console.log(e)}
}
// Define a global text font for all the app
const customFont = { 
  varelaRound: require("./assets/fonts/VarelaRound-Regular.ttf"),
}
// Creatw main navigator using 'react-navigation'
const Stack = createStackNavigator();
function MainNavigator(){
  return(
    <Stack.Navigator
    initialRouteName="initScreen"
      screenOptions={{ gestureEnabled: false }}>
        <Stack.Screen
         name='Home'
         component={HomePage}
         options={{header:(props)=>null}}/>
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
         options={{header:(props)=>null}}/>
         <Stack.Screen
         name='Compare'
         component={Compare}
         options={{header:(props)=>null}}/>
         <Stack.Screen
         name='Rating'
         component={Rating}
         options={{header:(props)=>null}}/>
         <Stack.Screen
         name='initScreen'
         component={InitScreen}
         options={{header:(props)=>null}}/>
         {/* <Stack.Screen 
         name='Testing'
         component={CustomList}
         options={{header:(props)=>null}}/> */}

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
  return <NavigationContainer><StatusBar hidden/><MainNavigator/></NavigationContainer>;
      
};
// textStyle:{fontFamily:'varelaRound'}// Add to fonts of all 
export default App