import React,{ useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../components/Footer'
import { HStack, VStack, Badge, Box } from 'native-base';
import myColor from '../styles/colors'
import * as FileSystem  from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import {Asset} from 'expo-asset';
import {connection} from '../data/DataSource';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';


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
    const Touchable = ({nav, txtStyle, placeholder, extras=null})=>{
        
        return (
            <LinearGradient
                colors={[ myColor.gold,'#fff', myColor.lightBlue]}
                locations={[0,0.2,0.8]}
                style={styles.touchables}
                start={[0, 0]} end={[1, 1]}
      >
                <TouchableOpacity 
                    style = {[{flex:1}]}
                    onPress={() => {
                        
                            if(!extras){
                                if(nav.params){
                                props.navigation.navigate(nav.route,nav.params)
                                }
                            }
                            else{
                                extras()
                            }
                        }}>
                    <View style={{justifyContent:'center',alignContent:'center', flex:1}} >
                        <Text adjustsFontSizeToFit style={txtStyle}>{placeholder}</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
    )};

     
    ///
    return(<SafeAreaView style={{flex:1}}
        onLayout={onLayoutRootView}
        >
        <View style = {styles.body}>
            <VStack flex={1} >
                <HStack flex={1} >
                    <Touchable nav={{route:'Feedback',params:{value:hospitals}}} txtStyle={[styles.buttonText,{fontSize:28}]} placeholder={'ספרי לנו על הלידה שלך'}/>
                    <Touchable nav={{route:'Rating',params:rating}} txtStyle={styles.buttonText} placeholder={'לתוצאות דרוג בתי יולדות'}/>
                </HStack>
                <HStack flex={1} >
                    <Touchable nav={{route:'Compare',params:{value:[hospitals,titles]}}} txtStyle={styles.buttonText} placeholder={'להשוואת בתי יולדות'}/>
                    <Touchable extras={()=>{
                    const uri = 'http://www.leidaraka.co.il/%D7%A7%D7%95%D7%A8%D7%A1-%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%9C%D7%99%D7%93%D7%94/';
                    // opens URL for online course
                    Linking.openURL(uri);
                    }} txtStyle={styles.buttonText} placeholder={'לקורס האונליין שלנו'}/>
                </HStack>
                <HStack flex={1} >
                    <Box flex={1}>
                        <Badge _text={{fontSize: 18, fontWeight:'bold'}} colorScheme="danger" zIndex={1} variant={"outline"} style={{elevation:5,position: 'absolute',top:20,start:20}}>בקרוב</Badge>
                        <Touchable nav={{route:'Podcasts',params:null}} txtStyle={styles.buttonText} placeholder={'לפודקאסט'}/>
                    </Box>
                    <Box flex={1}>
                        <Badge _text={{fontSize: 18, fontWeight:'bold'}} colorScheme="danger"  zIndex={1} variant={"outline"} style={{elevation:5,position: 'absolute',top:20,start:20}} >בקרוב</Badge>
                        <Touchable nav={{route:'Coupons',params:null}} txtStyle={styles.buttonText} placeholder={'לקבלת קופונים'}/>
                    </Box>
                
                </HStack>
            </VStack>
        </View>
        <Footer/>
        <StatusBar style="dark" hidden={(Platform.OS==='ios')?false:true}/>
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
        margin:1,
        flex:1,
    },
    buttonText: {
        textAlign: 'center',
        fontSize:24,
        fontWeight:'bold',
        fontFamily:'varelaRound',
        color:myColor.darkBlue,
    },
    touchables:{
        flex:1,
        margin:20,
        padding:10,
        borderColor:myColor.darkBlue,
        borderWidth:1,
        borderRadius:3,
        elevation:5,
    },
})