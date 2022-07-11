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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer'
import { HStack, VStack, Badge, Box } from 'native-base';
import myColor from '../styles/colors'
import * as FileSystem  from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import {Asset} from 'expo-asset';
import {connection} from '../data/DataSource';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

const hospIos =[
    {"id": 1, "name": "איכילוב- תל אביב",},
    {"id": 2,"name": "תל השומר שיבא- בקעת אונו",},
    {"id": 3,"name": "לניאדו- נתניה",},
    {"id": 4,"name": "מאיר- כפר סבא",},
    {"id": 5,"name": "קפלן- רחובות",},
    {"id": 6,"name": "מעייני הישועה- בני ברק",},
    {"id": 7,"name": "אסף הרופא- ראשל\"צ",},
    {"id": 8,"name": "וולפסון- יפו",},
    {"id": 9,"name": "בלינסון- פתח תקווה",},
    {"id": 10,"name": "עין כרם- ירושלים",},
    {"id": 11,"name": "שערי צדק- ירושלים",},
    {"id": 12,"name": "ביקור חולים- ירושלים",},
    {"id": 13,"name": "הר הצופים- ירושלים",},
    {"id": 14,"name": "סנט ג'וזף- ירושלים",},
    {"id": 15,"name": "אסותא אשדוד",},
    {"id": 16,"name": "ברזילי- אשקלון",},
    {"id": 17,"name": "סורוקה- באר שבע",},
    {"id": 18,"name": "יוספטל- אילת",},
    {"id": 19,"name": "הלל יפה- חדרה",},
    {"id": 20,"name": "העמק- עפולה",},
    {"id": 21,"name": "פוריה- טבריה",},
    {"id": 22,"name": "זיו- צפת",},
    {"id": 23,"name": "המרכז הרפואי לגליל-נהריה",},
    {"id": 24,"name": "רמב\"ם- חיפה",},
    {"id": 25,"name": "בני ציון (רוטשילד)- חיפה",},
    {"id": 26,"name": "כרמל- חיפה",},
  ];
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
                        // console.log(hospIos);
                    });
                });
            });
            setHospitals(hospIos)
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