import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform

} from 'react-native';
import{ Picker} from '@react-native-picker/picker'
import { Select, NativeBaseProvider, CheckIcon, Box, Center } from "native-base";
import myColor from '../styles/colors'
import DateTimePicker from '@react-native-community/datetimepicker'
import SelectableFlatlist, { STATE } from 'react-native-selectable-flatlist';
import NumericInput from 'react-native-numeric-input'
import StarRating from 'react-native-star-rating'
import CustomList from '../components/CustomFlatList';
// import CustomList from '../components/CustomFlatList'


global.entry = {qid:0, selectedItem:[]}; // should be a global object for father rendering

function Questionnaire(props) {

    
    const [showDate, setShowDate] = useState(false);
    const [currDate, setCurrDate] = useState(new Date());
    const [starCount, setStarCount] = useState(0);
    const [selected, setSelected] = useState([]);
    const [btnOpacity, setBtnOpacity] = useState(true);// false sould be default
    const [initialSelected, setInitialSelected] = useState([]);
    const [inpTxt,setInpTxt] = useState('');
    useEffect(()=>{
        if(props.submitted!=null){
            alreadyAnswerd(props.submitted)
        }
    },[]);
    // try setting as state instead -> replaces instead of merging it
    // props.submitted = [...{id: Number, answer:Array([...{aid:Number, val: - selected -}]), qtype: String}]
    const updateMultipleInitial = (answers) =>{
        let idx = props.questid - 1;
        if(props.questid >=4){
            idx = props.questid-2;
        }
        if(answers[idx] === undefined){
            return
        }
        if(answers[idx].qtype==='multiple_yn' ||
            answers[idx].qtype==='multiple'||
            answers[idx].qtype ==='checkbox'){
            answers[idx].answer.map((item,key)=>
                initialSelected.push(answers[idx].answer[key].aid));
        }
    }
    if(props.submitted!=null){
        updateMultipleInitial(props.submitted);
    }
    const alreadyAnswerd =(answers)=>{ // update states according to categories - already submitted
        let idx= props.questid - 1;
        if(props.questid >=4){
            idx = props.questid-2;
        }
        console.log(answers[idx].answer[0].val)
        if(answers[idx] === undefined){
            return
        }
        else if(answers[idx].qtype === 'dropdown'){
            setSelected(answers[idx].answer[0].val);
        }
        else if(answers[idx].qtype=== 'date'){
            setDate(answers[idx].answer[0].val);
        }
        else if(answers[idx].qtype === 'open_short'||
                answers[idx].qtype === 'open_numeric'||
                answers[idx].qtype === 'open_long'){
            setInpTxt(answers[idx].answer[0].val);
        }
        else if(answers[idx].qtype === 'rate'){
            setStarCount(answers[idx].answer[0].val);
        }
    }
    const onStarRatingPress=(rating) =>{
        setStarCount(rating);
        onItemsSelected([{aid:0,val:rating}])
    }
    const onChangeText=(text)=>{setInpTxt(text)};
    const datepicker = () => {setShowDate(true);}
    const onItemsSelected = (selectedItem) => {

        entry= {qid: props.questid,
            selectedItem: selectedItem,
            qtype: props.type,}
    };
    
    const rowItem = (item) => (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingHorizontal: 30,
            }}
            >
            <Text style={{fontWeight:'bold',fontSize:16, }}>{item.val}</Text>
        </View>
        )
    const setDate = (event, date) => {
        if(event.type == 'dismissed'){
            return;
        }
        date = date || currDate;
        setShowDate(Platform.OS === 'ios' ? true : false);
        setCurrDate(date)
        onItemsSelected([{aid:0,val:date}])
    }
    const multipleOrYn =(qType)=>{
        if(qType ==='multiple_yn')
            return true;
        return false

    };
    const _toggleOpacity = () =>{ //TODO:
        setBtnOpacity(!btnOpacity);
    };
    const renderChild = () =>{
        const qType = props.type;
        if(qType ==='multiple_yn'||qType==='multiple'){ 

            return(
            <View style = {{flex:1}}>
                {/* <CustomList data={ynArray(qid)} 
                            qType={qType} 
                            initialSelected={initialSelected}
                            itemsSelected={(selectedItem) => { onItemsSelected(selectedItem); }} /> */}
                <SelectableFlatlist ff
                    data={multipleOrYn(qType) ?ynArray(qid):generateAnswers(qid)}
                    state={STATE.EDIT}
                    multiSelect={false}// true for more than 1 options
                    itemsSelected={(selectedItem) => { onItemsSelected(selectedItem); }}
                    initialSelectedIndex={initialSelected}
                    cellItemComponent={(item, otherProps) => rowItem(item)}
                    touchStyles = {{
                        // flexDirection:'row',
                        backgroundColor:'transparent',
                        paddingHorizontal:18
                            }}
                    checkColor={myColor.darkBlue}
                    />
            </View>
            );
        }
        if(qType==='checkbox'){ // multiple choices
            return(
        <View style = {{flex:1}}>
                <SelectableFlatlist
                    data ={generateAnswers(qid)}
                    state={STATE.EDIT}
                    multiSelect={true}// more than 1 options
                    itemsSelected={(selectedItem) => { onItemsSelected(selectedItem); }}
                    initialSelectedIndex={initialSelected}
                    cellItemComponent={(item, otherProps) => rowItem(item)}
                    touchStyles = {{
                        // flexDirection:'row',
                        backgroundColor:'transparent'
                        ,paddingHorizontal:18
                    }}
                    checkColor={myColor.darkBlue}                    
                    /></View>
            );
        }
        if(qType === 'dropdown'){// hospital selection
            return(<Center>
                        <Box w="3/4" maxW="300" >
                            <Select borderColor={myColor.darkBlue} 
                                fontWeight="bold"
                                fontSize={"lg"} 
                                textAlign="center" 
                                selectedValue={selected} 
                                minWidth="200" 
                                accessibilityLabel="בחרי בית חולים" 
                                placeholder="בחרי בית חולים" 
                                _selectedItem={{
                                    bg: myColor.lightBlue,
                                    endIcon: <CheckIcon size="6" color={myColor.red}/>}} 
                                mt={1} 
                                onValueChange={(value)=>{
                                    if(value!=null){
                                        setSelected(value);
                                        onItemsSelected([{aid:0,val:value}]);// Replaced to aid 0 it is not required, only 1 value selected!
                                    }
                                }}>
                                {props.hospitals.map((item,i) => 
                                    (<Select.Item label={item.name} value={item.name} key={i}/>)
                                )} 
                            </Select>
                        </Box>
                    </Center>);
        }
        if(qType === 'open_short'){
            return(
                <View style = {styles.contentStyle}>
                <TextInput style={styles.txtInp}
                value={inpTxt}
                keyboardType="default"
                onChangeText={text => onChangeText(text)}
                onSubmitEditing = {(edit)=>{onItemsSelected([{aid:0,val:edit.nativeEvent.text}])}}/></View>
            );
        }
        if(qType === 'open_numeric'){
            let numOfBirth = 0;
            if(props.submitted[qid-1].answer.length>0){
                numOfBirth = props.submitted[qid-1].answer[0].val;
            }
            return(
                <View style = {[styles.contentStyle, {alignItems:'center'}]}>
                <NumericInput 
                    value = {numOfBirth}
                    onChange={value => onItemsSelected([{aid:0,val:value}])} 
                    minValue={1}
                    maxValue={10}
                    borderColor='gray'
                    rounded ={true}
                    totalWidth= {250}
                    />
                </View>
            );
        }
        if(qType === 'open_long'){
            return(
                <View style = {[styles.contentStyle,{flex:1}]}>
                <TextInput style={[styles.txtInp,
                            {textAlignVertical: 'top', 
                            padding:10, flex:1
                        }]}
                    value={inpTxt}
                    onChangeText={text => onChangeText(text)}
                    onKeyPress = {()=>{onItemsSelected([{aid:0,val:inpTxt}])}}
                    blurOnSubmit={true}
                    multiline={true}
                    maxLength={1000}
                /></View>
            );
        }
        if (qType === 'date'){// choose date of birth
            return( 
            <View>
                <TouchableOpacity style = {styles.dateContainer} 
                            onPress={datepicker}
                            >
                <View><Text style={{
                    textAlign:"center",
                    padding:50,
                    fontWeight:'bold',
                    fontSize:28,
                    color:myColor.darkBlue,
                }}>{currDate.getDate()+'/'+(currDate.getMonth()+1)+'/'+currDate.getFullYear()}</Text></View>
                </TouchableOpacity>
             {showDate &&
            <DateTimePicker 
                value={currDate}
                mode = 'date'
                display="default"
                maximumDate={new Date()}// Limit selection
                onChange={setDate} 
                // onChange={(e)=>{if(e.type == 'set'){this.setDate()}}} 
                />}
                </View>      );
        }
        if(qType === 'rate'){
            return(
                <View style = {styles.contentStyle}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        fullStarColor={myColor.gold}
                        rating={starCount}
                        selectedStar={(rating) => onStarRatingPress(rating)}
                    />
                </View>
            );
        }
        return (<View><Text style={styles.titles}>ERROR GETING DATA TYPES</Text></View>);
    
    }


    const submitted = props.submitted;
    const qid = props.questid;
    let touchableNext =(
        <TouchableOpacity 
            key={0}
            style = {[styles.btnContainer,{opacity:(btnOpacity)?1:0.5}]}
            // activeOpacity = {1}
            onPress={()=>{ 
                props.callbackFromParent(entry);// update parent array
                // already submitted answer-> answer array not empty
                
                var tmpIt = qid-1;
                if(qid >=4){
                    tmpIt = qid-2;
                }
                console.log(submitted[tmpIt])//
                // console.log(entry.selectedItem) //entry.selectedItem.length>0 ||
                if( submitted[tmpIt].answer.length>0 || qid === 48)//48
                    props.onPressNext();
            }}>
            <View style={{justifyContent:'center'}}>
                <Text style={[styles.btnStyle,]}>
                    {(qid==48)?'לסיום':'הבא'} 
                </Text>
            </View>
        </TouchableOpacity>
    );
    let touchableBack =(
        <TouchableOpacity 
                key={1}
                style = {styles.btnContainer}
                onPress={()=>{props.onPressBack();}}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.btnStyle}>
                        {'הקודם'}
                    </Text>
                </View>
            </TouchableOpacity>);
    let touchable;
    if(qid===1){
        touchable = touchableNext;
    }
    else{
        touchable = [touchableNext,touchableBack]
    }
        
    // Final render, 
    return(
        <NativeBaseProvider><View style={styles.cardView} >
        <View style={{flex:6}}>
            <View style={[styles.section]}>
                <Text style={styles.titles}>{props.question}</Text>
            </View>{/* title */}
            <View style={[{
                    flex:1, flexDirection:'column',justifyContent:'center'}, styles.section]} >
                {renderChild()}
            </View>
        </View>
    <View 
            style={{flexDirection:'row-reverse',
            flex:1, 
            paddingHorizontal:20}}>
            {touchable}
        </View> 
    </View></NativeBaseProvider>);
    
}



export default Questionnaire;

/// sgirat delet - לא יודעת

const generateAnswers = (id)=>{
    let answers = Array();
    if(id===7){//hitarvut
        answers = [{aid:0,val:'ניתוח קיסרי מתוכנן'},{aid:1, val:'ניתוח קיסרי חירום'},
                {aid:2,val:'חתך חיץ'}, {aid:3,val:'ואקום'},
                {aid:4, val:'אפידורל'},{aid:5,val:'זירוזים (סמני לפירוט)'},{aid:6, val:'לא נדרשה התערבות'}]
    }
    if(id===8){//keisari cherum
        answers = [{aid:0,val:'קיסרי חירום ללא חדר לידה'},{aid:1, val:'קיסרי חירום ללא שני'},
                {aid:2,val:'קיסרי חירום שעברה חדר לידה וגם שלב שני'},]
    }
    if(id===9){//sugey zeruz
        answers = [{aid:0,val:'פקיעת מי שפיר מלאכותית'},{aid:1,val:'בלון'},{aid:2,val:'פרופס/ פרוסטגלנדינים'},
        {aid:3,val:'סטריפינג'},{aid:4,val:'ציטוטק'},{aid:5,val:'פיטוצין'},{aid:6,val:'פפברין'}]
    }
    if(id===10){//livuy meyaledet
        answers = [{aid:0,val:'מיילדת חדר לידה'},{aid:1,val:'מיילדת מרכז/ חדר לידה טבעית'},
                {aid:2,val:'מיילדת פרטית'},{aid:3,val:'רופא/ה פרטי/ת'}]
    }
    if(id===11){//livuy nosaph
        answers = [{aid:0,val:'בן/ בת זוג'},{aid:1,val:'בן / בת משפחה אחר/ת'},
                {aid:2,val:'חבר/ה'},{aid:3,val:'דולה'},{aid:4,val:'ללא'}]
    }
    if(id===32){//shicuch keevim (survey)
        answers = [{aid:0,val:'אפידורל'},{aid:1,val:'אופייטים (פטידין)'},
                {aid:2,val:'טכניקות הרפייה (הרפיית שרירים פרוגרסיבית, נשימות, מוזיקה, מיינדפולנס)'}
                ,{aid:3,val:'טכניקות פיזיות לשיכוך כאבים (עיסוי גב, בקבוק מים חמים)'},
                {aid:4,val:'גז צחוק'},{aid:5,val:'לא הוצע'},]
    }
    if(id===34){//תנוחות לידה
        answers = [{aid:0,val:'שכיבה על הגב'},{aid:1,val:'חצי שכיבה'},
                {aid:2,val:'ישיבה זקופה (כיסא לידה או קצה המיטה)'},{aid:3,val:'שכיבה על הצד'},
                {aid:4,val:'כריעה'},{aid:5,val:'עמידת ברכיים'},
                {aid:6,val:'עמידת שש'},{aid:7,val:'עמידה'},{aid:8,val:'לידת מים'},]
    }
    if(id===37){//תמיכה בפרניאום
        answers = [{aid:0,val:'עסוי'},{aid:1,val:'קומפרסים חמים / בריכת מים'},
                {aid:2,val:'שמירה עם תמיכת ידנית'},{aid:3,val:'לא הוצע'}]
    }
    if(id===43){//סיבת הפרדה
        answers = [{aid:0,val:'סיבה רפואית'},{aid:1,val:'סיבה מנהלתית'},{aid:2,val:'אחר'}]
    }
    return answers;
}


const ynArray=(id)=>{
    let arr = Array()
    arr = [{aid:0,val:'כן'},{aid:1,val:'לא'}]
    if(id===14){
        arr.push({aid:2,val:'לא יודעת'})
    }
    return arr;
}
const styles = StyleSheet.create({
    btnContainer:{
        backgroundColor: myColor.red,
        justifyContent:'center',
        marginVertical:10,
        borderWidth:2,
        borderColor:myColor.darkBlue,
        flex:1,
        borderRadius:10,
    },
    dateContainer:{
        
        borderColor:myColor.darkBlue,
        borderWidth:1,
        margin:20,
        borderRadius:10,
    },
    titles:{
        textAlign:"center",
        fontWeight:'bold',
        fontSize:28,
        color:myColor.darkBlue,
        paddingTop:30,
        paddingHorizontal:28
    },
    txtInp:{
        borderRadius:10,
        marginBottom:30,
        borderWidth:1,
        borderColor:'gray',
        backgroundColor:'#00000006',
        fontSize:18,
        padding:6
    },
    btnStyle:{
        textAlign:'center',
        padding: 12, 
        fontSize:18,
        color: 'white', 
        flexWrap: 'wrap',
    },
    contentStyle:{
        margin:30,
    },
    cardView:{
        flex: 1,
        resizeMode: "cover",
        backgroundColor: 'transparent',
    }
    ,
    section:{
        borderWidth:2,
        borderRadius: 10, 
        borderColor:myColor.darkBlue,
        backgroundColor: '#F5F8F9',
    }
});