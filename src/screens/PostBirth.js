import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView, 
    Animated, 
    Alert,
} from 'react-native';
import {AlertDialog,Button} from 'native-base'
import myColor from '../styles/colors'
import Questionnaire  from './PostBirthQuestionnaire';//Survey
import Footer from '../components/Footer'
import * as SQLite from 'expo-sqlite'
import {LinearGradient} from 'expo-linear-gradient';
import {connection} from '../data/DataSource'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions ,StackActions} from '@react-navigation/native';
 // Open data base and get questions table
var db = SQLite.openDatabase('qoest_db.db');
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

///////////////////////////////////////
function Feedback(props){
    
    const clearResArr=()=>{
        // Remove all records so far in results array
        global.resultArray = new Array(47);//48
        for(let i=0;i<resultArray.length;i++){
            if(i<2){
                resultArray[i] ={id:i+1,answer:[],qtype:null};
            }
            else{
                resultArray[i] ={id:i+2,answer:[],qtype:null};
            }
        }
        
    } 
    // on mount component functional hook - clears the array on mount
    useEffect(()=>{clearResArr()},[]);
    // States and react native HOOKS
    const position = new Animated.ValueXY();
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [current, setCurrent] = useState(0);// 47
    const [mail, setEmail] = useState("");
    const [hospitals,setHospitals] = useState([])
    const navigation = useNavigation(); 
    const [formComplete, setFormComplete] = useState(false);

    const res = (results) =>{
        var questions = [];
        for (let i = 0; i < results.rows.length; ++i) {
            questions.push(results.rows.item(i));
        }
        setSurveyQuestions(questions);
        console.log(questionsIos);
    }
    const loadAsyncData = async () =>{ 
            // Categories: Ifyun 0-10, Mashov 11-27 , Seker 28-44, SviutRatzon 45-47
            setSurveyQuestions(questionsIos);
        // db.transaction(tx => {
        // tx.executeSql('SELECT * FROM questions_table', [], (tx, results) => res(results))});
        
        // fetch user email from stored data - for identification of submitter
        AsyncStorage.getItem('email').then((mail)=>{
            setEmail(mail);
          } );
        const { route } = props;
        let hospitals = route.params?.value ?? 'A problem fetching data'; 
        setHospitals(hospitals);
    };
    // on mount 'hook' - preform local db actions
    useEffect(()=>{
        loadAsyncData();
    },[]); 
    // Prevent exit on back press, confirmation with user - hook for background action
    useEffect( () =>{
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if(formComplete)
        {
            return;
        }
        e.preventDefault();
        Alert.alert(
          'האם את בטוחה שאת רוצה לצאת?',
          'נתוני הטופס שמילאת לא יישמרו',
          [
            { text: "ביטול", style: 'cancel', onPress: () => {} },
            {
              text: 'אישור',
              style: 'destructive',
              onPress: () => props.navigation.dispatch(e.data.action),
            },
          ]
        );
      });
      return unsubscribe;},
    [navigation, formComplete]
    );
    const updateEntries = (dataFromChild) => {
        // updates entry if user decides to change answer
        // no item selected, do not try to update/enter
        
        if(dataFromChild.selectedItem.length == 0){
            return null
        }
        // enter new values
        let ind = dataFromChild.qid-1
        if(dataFromChild.qid>=4){
            ind -= 1
        }

        resultArray[ind] = {
            id:dataFromChild.qid, 
            answer:[...dataFromChild.selectedItem], 
            qtype:dataFromChild.qtype,
        }
        
    }
    // card movement actions 
    const moveForword=()=>{
        
        let curr = filterForword(resultArray)
        Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: 0 },
            useNativeDriver: true,
          }).start(() => {
            setCurrent(curr);
          })
    }
    const moveBackwords=()=>{
        let curr = filterBack()
        Animated.spring(position, {
            toValue: { x: -80, y: 0 },
            useNativeDriver: true,
          }).start(() => {
              setCurrent(curr);
          })
    }
    // filters for ignoring cards , include skip logic
    const filterBack=()=>{
        let idx = current-1
        const boolDepend = surveyQuestions[idx].depends /// 0/1
        if(boolDepend === 1){ // Skip backwords
            while(surveyQuestions[idx].depends === 1){
                idx-=1
            }
            return idx
        }
        return idx
    }
    //include skip logic
    const filterForword = (resultArr)=>{
        const editArr = surveyQuestions.slice();
        
        if(resultArr[current].id === 42){// child seperation use case
            if(resultArr[current].answer[0].aid === 0)//כן
            {
                editArr[current+1].depends = 0
            }
            else{
                editArr[current+1].depends = 1
                editArr[current+2].depends = 1
            }
        }
        if(resultArr[current].id === 43 && editArr[current].depends === 0){ // other reason for seperation
            if(resultArr[current].answer[0].aid === 2)// אחר
            {
                editArr[current+1].depends = 0
            }
            else{
                editArr[current+1].depends = 1
            }
            
        }
        
        if(resultArr[current].id === 7){
            
            let skipArr = [true,true];
            // reset if going back to change value
            hideQuestions(editArr,true,0)
            editArr[31].depends = 1

            for(let i = 0; i<resultArr[current].answer.length;i++){
                if(resultArr[current].answer[i].aid === 1){//'ניתוח קיסרי חירום'
                    editArr[current+1].depends = 0
                    editArr[31].depends = 0// הגיעה לשלב שני?
                    skipArr[0] = false;
                }
                if(resultArr[current].answer[i].aid === 5){//'זירוזים (סמני לפירוט)'
                    editArr[current+2].depends = 0
                    skipArr[1] =false;
                }
                // other logical hiding:
                if(resultArr[current].answer[i].aid === 0)//ניתוח קיסרי מתוכנן
                {
                    hideQuestions(editArr, true, 1)
                }
            }
            if(skipArr[0] && skipArr[1]){
                editArr[current+1].depends = 1
                editArr[current+2].depends = 1
            }
            else if(skipArr[0]){//skip keisari
                editArr[current+1].depends = 1
            }
            else if(skipArr[1]){// skip Zeruzim
                editArr[current+2].depends = 1
            }
        }
        if(resultArr[current].id === 8 && editArr[current].depends === 0){
            if(resultArr[current].answer[0].aid === 0){//קיסרי חירום ללא חדר לידה
                
                hideQuestions(editArr, true, 1)
            }
            if(resultArr[current].answer[0].aid === 1){// קיסרי חירום ללא שני
                hideQuestions(editArr, false, 1)
            }
        }
        if(resultArr[current].id === 33 && editArr[current].depends === 0){// האם הגעת לשלב השני של הלידה (צירי לחץ)?
            if(resultArr[current].answer[0].aid === 1){// לא
                hideQuestions(editArr, false, 1)
            }
        }
        
            
        if(resultArr[current].id === 5 || resultArr[current].id === 25){// פירוט הריון בסיכון
            if(resultArr[current].answer[0].val ==='כן'){
                editArr[current+1].depends = 0
            }
            else{
                editArr[current+1].depends = 1
            }
        }
        setSurveyQuestions(editArr);// update array
        let idx = current+1;
        if(surveyQuestions[idx].depends === 1){
            while(surveyQuestions[idx].depends ==1){
                setEmptyAnswer(idx);// needed for reseting cases if we go back and change answer for skipping logic
                idx += 1;
            }
            // console.log('skip to ' + idx)
            return idx
        }
        return idx;
    }
    const setEmptyAnswer=(ind)=>{
        resultArray[ind] ={
            id:ind+1, 
            answer:[],
            qtype:null,
        }
    }
    const hideQuestions=(edit, isLong, hide)=>{//to hide- hide=1
        if(isLong){
            edit[12].depends = hide//האם היתה קיימת אפשרות לסגירת הדלת במהלך הטיפול שקבלת?
            edit[13].depends = hide// באיזו מידה חשת שסביבת הלידה שלך שקטה?
            edit[14].depends = hide//האם אנשי הצוות דפקו בדלת או התריעו לפני הסטת וילון?
            edit[15].depends = hide// האם היו שרותים ומקלחת צמודים זמינים לך בלידה?
            edit[27].depends = hide// האם עודדו אותך לתנועה ולבחירת תנוחות זקופות במהלך הלידה?
            edit[28].depends = hide// האם המליצו לך לשתות ולאכול במהלך השהות בחדר הלידה?
            edit[29].depends = hide// האם תכננת לידה ללא תרופות משככות כאבים?
            edit[30].depends = hide// איזו מהאפשרויות הבאות הוצעה לך לשיכוך כאבים? (ניתן לבחור יותר מאפשרות אחת)
            
        }
        
        edit[32].depends = hide// באיזו תנוחת לידה ילדת?
        edit[33].depends = hide// האם עודדו אותך לבחור תנוחה מועדפת (בין היתר, תנוחה זקופה)? 
        edit[34].depends = hide// האם עודדו אותך ותמכו בך להיענות לתחושת הדחף של גופך?
        edit[35].depends = hide// האם הוצעו לך טכניקות למניעת נזקים לפרינאום: (ניתן לבחור יותר מאפשרות אחת) 
        edit[36].depends = hide// האם הופעל לחץ פיזי חיצוני (קריסטלר) על בטנך לקידום הלידה? 
        return edit;
    }
    const render = () => {
        // the main render of this component - creates animation and logic update
        // ### Animation configuration
        const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
        });
        const rotateAndTranslate = {
            transform: [{
            rotate: rotate
            },
            ...position.getTranslateTransform()
            ]
        }
        // render cards for survey
        return surveyQuestions.map((item, i) => {
            
            if (i < current) {
                return null; 
            }
            else if (i == current){
                return (
                <Animated.View
                key={i}
                style={[
                    rotateAndTranslate ,
                    styles.card
                ]
                }>
                        <Questionnaire // props from survey component: // Survey 
                            questid ={item.id} 
                            question={item.question} 
                            type = {item.type}
                            hospitals = {hospitals} // hospital list
                            onPressNext={() => {
                                if(current < surveyQuestions.length-1){
                                    moveForword();
                                }
                                else{// last card -
                                    //send data to server
                                    if(resultArray[46].answer.length === 0){// make sure array is full (mainly for testing)
                                        clearResArr();
                                        setCurrent(0);
                                        return; 
                                    }
                                    // set date as dd/mm/yyyy in result array
                                    if(resultArray[0].answer.length !== 0){
                                        let date = resultArray[0].answer[0].val;
                                        let formattedDate = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                                    
                                        resultArray[0].answer[0].val = formattedDate;// date of submission
                                    }
                                    setFormComplete(true);
                                    // removing empty input:
                                    // resultArray.splice(2,1);
                                    let successSubmition = submitToServer(resultArray, props, mail);
                                    if(!successSubmition){
                                        // update state... Failed to submit entry
                                        clearResArr();
                                        setCurrent(0);
                                    }
                                }
                            }}
                            onPressBack={moveBackwords}
                            callbackFromParent = {updateEntries} 
                            submitted = {resultArray}
                            />
                </Animated.View>
                );
            }
        }).reverse();
    };
    // Final return component for render:
    return(
        <SafeAreaView style={{flex:1}}>
        <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                        locations={[0,0.1,0.7,1]}
                        style={styles.linearGradient}>
        <View style={{ flex: 1 }}>
        {render()}
        </View>
    </LinearGradient>
    <Footer/>
    </SafeAreaView>
)
}
export default Feedback;

const submitToServer = (data,props, userId) =>{
    let successToken = false;
    let submition = JSON.stringify({
        'data':data,
        'email':userId,
    })
    let formData = new FormData();
    formData.append('data',submition);
    fetch(connection.URL+'submit.php', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'multipart/form-data' 
          },
        body: formData
      })
      .then((response) =>{
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(responseData => {
              // The response was a JSON 
              if(responseData.error){ 
                Alert.alert('שגיאה','תקלה באיחסון נתונים בשרת, נסי שוב מאוחר יותר');
              }
              else{
                Alert.alert('הנתונים נקלטו במערכת בהצלחה','תודה על מילוי המשוב',
                        [
                    {text: 'אישור', onPress: () => console.log('OK Pressed')},
                    ]
                );
                const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
                  props.navigation.dispatch(resetAction)
                  successToken = true;
              }
              successToken = true;
            });
          } else {
            return response.text().then(text => {
              // The response wasn't a JSON object
              Alert.alert('שגיאה','תקלה באיחסון נתונים בשרת, נסי שוב מאוחר יותר');
              console.error('Action not complete:'+ text)
              successToken = false;
            });
          }
      }).done();
      return successToken;
}
const styles = StyleSheet.create({
    linearGradient: {
        flex:1
    },
    progress:{
        flex:1,
        flexDirection:'row-reverse',
        alignSelf:'center',
        
        padding:15,
    },
    circle:{
        height:15, 
        width:15,
        borderRadius:15/2,
        borderColor:'#000',
        borderWidth:1,
        marginHorizontal:5
    },
    modalTxt:{
        textAlign:'center',
        padding:35,
    },
    card:{
        height: SCREEN_HEIGHT-60,
        width: SCREEN_WIDTH,
        paddingTop: 5,
        position:'absolute',
    },
    
    
});

const questionsIos =[{
      "depends": 0,
      "id": 1,
      "question": "אנא בחרי את התאריך בו ילדת",
      "type": "date",
    },
     {
      "depends": 0,
      "id": 2,
      "question": "איפה ילדת?",
      "type": "dropdown",
    },
     {
      "depends": 0,
      "id": 4,
      "question": "מספר לידה",
      "type": "open_numeric",
    },
     {
      "depends": 0,
      "id": 5,
      "question": "האם ההריון הוגדר כהריון בסיכון גבוה?",
      "type": "multiple_yn",
    },
     {
      "depends": 1,
      "id": 6,
      "question": "פרטי:",
      "type": "open_short",
    },
     {
      "depends": 0,
      "id": 7,
      "question": " האם נדרשת לאחת  או יותר מההתערבויות הבאות?",
      "type": "checkbox",
    },
     {
      "depends": 1,
      "id": 8,
      "question": "במידה ובחרת קיסרי חירום:",
      "type": "multiple",
    },
     {
      "depends": 1,
      "id": 9,
      "question": "סוגי זירוז(אחד או יותר):",
      "type": "checkbox",
    },
     {
      "depends": 0,
      "id": 10,
      "question": "סמני איזה לווי מיילדותי/ רפואי היה לך בלידה?",
      "type": "multiple",
    },
     {
      "depends": 0,
      "id": 11,
      "question": "סמני איזה לווי נוסף היה לך בלידה?",
      "type": "checkbox",
    },
     {
      "depends": 0,
      "id": 12,
      "question": "באיזו מידה חשת שקבלת טיפול מכבד בלידה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 13,
      "question": "באיזו מידה חשת שנשמרה פרטיותך בזמן הלידה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 14,
      "question": "האם היתה קיימת אפשרות לסגירת הדלת במהלך הטיפול שקבלת?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 15,
      "question": "באיזו מידה חשת שסביבת הלידה שלך שקטה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 16,
      "question": "האם אנשי הצוות דפקו בדלת או התריעו לפני הסטת וילון?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 17,
      "question": "האם היו שרותים ומקלחת צמודים זמינים לך בלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 18,
      "question": "באיזו מידה חשת שנשמר חסיונך הרפואי?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 19,
      "question": "באיזו מידה חשת שנשמר חסיונן הרפואי של היולדות סביבך?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 20,
      "question": "באיזו מידה ניתן לך הסבר על הטיפול המוצע- הכולל סיכויים, סיכונים וחלופות למהות הטיפול?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 21,
      "question": "האם חשת איום או הפחדה ביחס לטיפול המוצע או החלופות הקיימות?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 22,
      "question": "באיזו מידה חשת שאת שותפה בקבלת ההחלטות בלידה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 23,
      "question": "באיזו מידה כובדו בקשותיך במהלך הלידה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 24,
      "question": "באיזו מידה התיחסו לרצונותיך במהלך הלידה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 25,
      "question": "האם סירבת לטיפול שהוצע?",
      "type": "multiple_yn",
    },
     {
      "depends": 1,
      "id": 26,
      "question": "האם קיבלו את סירובך?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 27,
      "question": "באיזו מידה חשת תמיכה אנושית רציפה מצוות בית החולים במהלך הצירים והלידה ו/או ניתוח קיסרי?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 28,
      "question": "באיזו מידה התקשורת של הצוות המטפל בך בלידה היתה נעימה?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 29,
      "question": "האם עודדו אותך לתנועה ולבחירת תנוחות זקופות במהלך הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 30,
      "question": "האם המליצו לך לשתות ולאכול במהלך השהות בחדר הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 31,
      "question": "האם תכננת לידה ללא תרופות משככות כאבים?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 32,
      "question": "איזו מהאפשרויות הבאות הוצעה לך לשיכוך כאבים? (ניתן לבחור יותר מאפשרות אחת)",
      "type": "checkbox",
    },
     {
      "depends": 1,
      "id": 33,
      "question": "האם הגעת לשלב השני של הלידה (צירי לחץ)?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 34,
      "question": "באיזו תנוחת לידה ילדת?",
      "type": "multiple",
    },
     {
      "depends": 0,
      "id": 35,
      "question": "האם עודדו אותך לבחור תנוחה מועדפת (בין היתר, תנוחה זקופה)?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 36,
      "question": "האם עודדו אותך ותמכו בך להיענות לתחושת הדחף של גופך?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 37,
      "question": "האם הוצעו לך טכניקות למניעת נזקים לפרינאום: (ניתן לבחור יותר מאפשרות אחת)",
      "type": "checkbox",
    },
     {
      "depends": 0,
      "id": 38,
      "question": "האם הופעל לחץ פיזי חיצוני (קריסטלר) על בטנך לקידום הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 39,
      "question": "האם תינוקך היה איתך במגע עור לעור במשך לפחות שעה לאחר הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 40,
      "question": "האם תינוקך הוצמד לחזה שלך לצורך הנקה מוקדם ככל שניתן היה לאחר הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 41,
      "question": "האם הציעו לך להשהות את רחצת תינוקך במשך 24 שעות לאחר הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 42,
      "question": "האם הופרדת מתינוקך לאחר הלידה?",
      "type": "multiple_yn",
    },
     {
      "depends": 1,
      "id": 43,
      "question": "מה הסיבה?",
      "type": "multiple",
    },
     {
      "depends": 1,
      "id": 44,
      "question": "סיבה אחרת:",
      "type": "open_short",
    },
     {
      "depends": 0,
      "id": 45,
      "question": "האם שהית עם תינוקך באותו חדר 24 שעות ביממה?",
      "type": "multiple_yn",
    },
     {
      "depends": 0,
      "id": 46,
      "question": "באיזו מידה את מרוצה מחויית הלידה שלך?",
      "type": "rate",
    },
     {
      "depends": 0,
      "id": 47,
      "question": "ספרי בקצרה על חווית הלידה שלך, תוך ציון חוויות וארועים משמעותיים",
      "type": "open_long",
    },
     {
      "depends": 0,
      "id": 48,
      "question": "כתבי לנו פה הערות או שאלות שאינן לפרסום באתר ונשמח לחזור אליך באופן פרטי. כדאי להשאיר מספר טלפון ליצירת קשר",
      "type": "open_long",
    },
  ]