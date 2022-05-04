import React,{ useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer'
import MainHeader from '../components/MainHeader'
import myColor from '../styles/colors'
import * as FileSystem  from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import {Asset} from 'expo-asset';
import {connection} from '../data/DataSource';
import * as SplashScreen from 'expo-splash-screen';
// Get access to frontend database
export default function HomePage(props){
    const [appIsReady, setAppIsReady] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [titles, setTitles] = useState([]);
    const [rating, setRating] = useState([]);
    useEffect(()=>{
        prepare();
    },[]);
    async function prepare(){
        try{
            await SplashScreen.preventAutoHideAsync();
            // query local db
            await openDatabase().then((db)=>{
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM hospitals', [], (tx, results) => {
                        var hospitalist = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                        // inserts all rows to list
                        hospitalist.push(results.rows.item(i));
                        }
                        setHospitals(hospitalist)
                    });
                });
            });
            await fetchData();

        }
        catch(e){
            console.warn(e);
        }
        finally{
            setAppIsReady(true);
        }
    }
    async function fetchData(){
        // Fetch data from server... 
            /**  Compare table titles*/
            /**  Rating results (using python)*/
        Promise.all([fetch(connection.URL+'titles.php'),fetch(connection.URL+'rating.php')])
            .then(([titles,rating])=>Promise.all([titles.json(), rating.json()]))
            .then(([titles,rating])=>{setTitles(titles);setRating({mid: 0,rating});})
            .catch((e)=>console.error(e));
            
    }
    const onLayoutRootView = useCallback(async () => {
        
        if (appIsReady) {
          // we hide the splash screen once we know the root view has already
          // performed layout.
          await SplashScreen.hideAsync();
        }
    }, [appIsReady]);
    
    if (!appIsReady) {
        return null;
    }
    
    async function userLogout(){
        try {
            // Remove user token from storage
            await AsyncStorage.removeItem('id_token');
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    };
     
    ///
    return(<SafeAreaView style={{flex:1}}
        onLayout={onLayoutRootView}
        >
        <View style={{flex:0.1}}>
        <MainHeader logState={userLogout} {...props}/>
        </View>
        <View style = {styles.body}>
            <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                    style = {styles.touchables}
                    onPress={() => {
                        props.navigation.navigate('Feedback',{value:hospitals})}}>
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}} >
                        <Text style={styles.toRate}>ספרי לנו על הלידה שלך</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                    style = {styles.touchables}
                    onPress={() => {
                        props.navigation.navigate('Rating',rating)}}>
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}}>
                        <Text style={styles.buttonText}>לתוצאות דרוג בתי יולדות</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                    style = {styles.touchables}
                    onPress={() => {
                        props.navigation.navigate('Compare',{value:[hospitals,titles]})}}>
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}}>
                        <Text style={ styles.buttonText}>להשוואת בתי יולדות</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                    style = {styles.touchables}
                    onPress={() => {
                        const uri = 'http://www.leidaraka.co.il/%D7%A7%D7%95%D7%A8%D7%A1-%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%9C%D7%99%D7%93%D7%94/';
                        // opens URL for online course
                        Linking.openURL(uri);}}>
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}}>
                        <Text style={styles.buttonText}>לקורס האונליין שלנו</Text>
                    </View>
                
                </TouchableOpacity>
                </View>
                <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                style = {styles.touchables}
                    onPress={() => {
                       // props.navigation.navigate('Testing')///
                    // props.navigation.navigate('Podcasts')
                }}
                >
                <View style={{justifyContent:'center',alignContent:'center', flex:1}}>
                    <Text style={styles.buttonText}>לפודקאסט</Text>
                </View>
                <Text style={styles.comingSoon}>בקרוב!</Text>
                
                </TouchableOpacity>
                </View>
                <View style = {styles.touchableContainer}>
                <TouchableOpacity 
                activeOpacity={.5}
                style = {styles.touchables}
                // onPress={() => {
                //     props.navigation.navigate('Coupons')}}
                    >
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}}>
                        <Text style={styles.buttonText}>לקבלת קופונים</Text>
                    </View>
                        <Text style={styles.comingSoon}>בקרוב!</Text>
                    
                </TouchableOpacity>
                </View>
            </View>
            <Footer/>
    </SafeAreaView>);
}



async function openDatabase() {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    }
    await FileSystem.downloadAsync(
      Asset.fromModule(require('../../assets/qoest_db.db')).uri,
      FileSystem.documentDirectory + 'SQLite/qoest_db.db'
        ).catch(error => {
            console.error(error);
        });
    return SQLite.openDatabase('qoest_db.db');
}

const styles = StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        paddingTop: 0,
        paddingHorizontal:0,
        marginHorizontal:-1,
        flex:1,
        elevation:19,
    },
    buttonText: {
        textAlign: 'center',
        fontSize:24,
        fontWeight:'bold',
        color:myColor.darkBlue,
    },
    toRate:{
        textAlign: 'center',
        fontSize:28,
        fontWeight:'bold',
        color:myColor.darkBlue,
    },
    touchables:{
        flex:1,
        padding:4,
        borderColor:myColor.darkBlue,
        borderWidth:1,
        borderRadius:5,
        
    },
    
    touchableContainer:{
        flex:1,
        backgroundColor:myColor.lightBlue,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row-reverse',
        borderColor:'#fff',
        borderWidth:1,
        padding:4,
        
    },
    comingSoon:{
        textAlign: 'justify',
        padding: 10,
        fontSize:22,
        color:myColor.red,
        fontWeight:'bold',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },  
})