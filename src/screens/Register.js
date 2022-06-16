import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { CommonActions} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'
import { Alert as NbAlert, HStack, useToast, Box, FormControl, Input,WarningOutlineIcon } from 'native-base';

function Register(props){
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username,setUsername] = useState(null);
    const [isTheSame, setIsTheSame] = useState(false);
    const [eEmail, setEEmail] = useState(1); 
    const [ePassword, setEPassword] = useState(1); 
    const [eUser, setEUser] = useState(1); 
    const [uErrorVisible, setUErrorVisible] = useState(false); 
    const [pErrorVisible, setPErrorVisible] = useState(false); 
    const [eErrorVisible, setEErrorVisible] = useState(false); 
    const [imageOpacity, setImageOpacity] = useState(1);
    const toast = useToast();

    const ref_email = useRef(null);
    const ref_pass1 = useRef(null);
    const ref_pass2 = useRef(null);

    useEffect(()=>{
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {setImageOpacity(0.5)});
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {setImageOpacity(1)});
        return ()=>{
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    },[]);
    const userSignup = () => {
        //  verify legit input...
        if (!validateInput()){
            return;
        }
        if (!email || !password || !username || !isTheSame) {
            toastMessege('יש למלא את כל השדות')
            // Alert.alert('שגיאה','יש למלא את כל השדות');
            return;
        }
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        let fd = new FormData()
        fd.append('email',email);
        fd.append('password', password);
        fd.append('name', username); 
        fetch(connection.URL+'register.php', {
          method: 'POST',
          headers: { 
              Accept: 'application/json', 
              'Content-Type': 'multipart/form-data' 
            },
          body: fd
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.error == true){
                Alert.alert('שגיאה',responseData.error_msg)
            }
            else{
                Alert.alert('הרשמה','תודה שנרשמת לאפליקציה\n\nנשלח לך אימייל אימות, יש לבצע אימות על מנת להתחבר למשתמשת')
                props.navigation.dispatch(resetAction)
            }
        })
        .done();
    }
    const comparePasswords = (str) => {
        if(str === password){
            setIsTheSame(true);
            setEPassword(1);
            setPErrorVisible(false);
        }
        else{ 
            setIsTheSame(false);
            setEPassword(3);
            setPErrorVisible(true);
        }
    }
    const toastMessege = (msg) =>{
        toast.show({
          render: () => {
            return (<Box rounded="sm" px="2" py="1" bg="warning.200">
                  <HStack flexShrink={1} space={2} justifyContent="space-between">
            <NbAlert.Icon mt="1" color="warning.800" />
          <Text style={{textAlign:'center', margin:2, fontWeight:"bold"}}>
            {msg}
          </Text>
          </HStack></Box>);
          }
        });
      };
    const validateInput = (inp, type) => {
        let valid = true;
        let reE = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        let reP = /^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
        let reU = /^(?=.{3,})/;
        if(!reE.test(email)){
            setEEmail(3);
            setEErrorVisible(true);
            valid = false;
        }
        if(!reP.test(password)){
            toastMessege('הסיסמה צריכה להיות לפחות באורך 6 ובאנגלית, להכיל אותיות קטנות, אותיות גדולות ומספרים')
            // Alert.alert('שגיאה','הסיסמה צריכה להיות לפחות באורך 6 ובאנגלית, להכיל אותיות קטנות, אותיות גדולות ומספרים',
            //         [{ text: "חזרה", style: 'cancel', onPress: () => {} },]
            //     );
            setEPassword(3);
            valid = false;
        }
        if(!reU.test(username)){
            setEUser(3);
            setUErrorVisible(true);
            valid = false;
        }
        return valid;
    }
    return(
        <SafeAreaView style={{flex:1}}>  
            <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                        locations={[0,0.1,0.7,1]}
                        style={styles.linearGradient}>
                
                <ScrollView 
                    style={[styles.scrollView,]}//{marginTop:height}
                    >
                        <Image source={require('../../assets/img/yoldot_logoT.png')} style = {[styles.logo,{opacity:imageOpacity}]}/>
                    <SafeAreaView>
                    
                    <View style = {[styles.container,]}>
                        
                        <Text style = {styles.fieldTxt}>שם</Text>
                        <TextInput
                            editable={true}
                            onChangeText={(username) => setUsername(username)}
                            placeholder='Username'
                            onSubmitEditing={()=>ref_email.current.focus()}
                            returnKeyType='next'
                            value={username} 
                            style={[styles.txtInp,{borderWidth:eUser}]}/>
                        {uErrorVisible && <View ><Text style = {styles.error}>*שם משתמש צריך להכיל לפחות 3 תווים</Text></View>}
                        <View style={{marginBottom:10}}></View>
                        <Text style = {styles.fieldTxt}>אי מייל</Text>
                        {/* <FormControl isInvalid>
                            <FormControl.Label>אי מייל</FormControl.Label>
                            <Input 
                                value = {email} 
                                placeholder='example@example.com'
                                onChangeText = {(email)=>setEmail(email)} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            אימייל לא תיקני
                            </FormControl.ErrorMessage>
                        </FormControl> */}
                        <TextInput 
                            editable={true}
                            onChangeText = {(email)=>
                                {
                                    setEmail(email);
                                }
                            }
                            placeholder = 'example@example.com'
                            onSubmitEditing={()=>ref_pass1.current.focus()}
                            ref={ref_email}
                            returnKeyType='next'
                            value = {email}
                            keyboardType='email-address' 
                            textContentType='emailAddress' 
                            style={[styles.txtInp,{borderWidth:eEmail}]}/>
                        {eErrorVisible && <View><Text style = {styles.error}>*אימייל לא תיקני</Text></View>}
                        <View style={{marginBottom:10}}></View>
                        <Text style = {styles.fieldTxt}>סיסמה</Text>
                        <TextInput 
                            editable={true}
                            onChangeText={(password) => setPassword(password)}
                            placeholder='Password'
                            onSubmitEditing={()=>ref_pass2.current.focus()}
                            ref={ref_pass1}
                            returnKeyType='next'
                            value={password}
                            textContentType='password' 
                            secureTextEntry={true} 
                            autoCorrect={false}
                            autoCapitalize='none'
                            style={[styles.txtInp,{borderWidth:ePassword, marginBottom:10}]}/>
                        <Text style = {styles.fieldTxt}>אימות סיסמה</Text>
                        <TextInput 
                            onChangeText={(password) => comparePasswords(password)}
                            editable={true}
                            ref={ref_pass2}
                            style={[styles.txtInp,{borderWidth:ePassword,}]} 
                            textContentType='password' 
                            placeholder='Password'
                            returnKeyType='next'
                            value={null}
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize='none' />
                        {pErrorVisible && <View><Text style = {styles.error}>*סיסמאות לא זהות</Text></View>}
                        <View style={{marginBottom:10}}></View>
                        <TouchableOpacity 
                        style = {styles.btnContainer}
                        onPress={userSignup}
                        >
                            <View style={{justifyContent:'center'}}
                        >
                                <Text style={{textAlign:'center',color: 'white', fontSize:18, padding: 12}}>
                                    {'הרשמי'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </SafeAreaView>
                </ScrollView>
                </LinearGradient>
        </SafeAreaView>
    )
}
export default Register;

const styles = StyleSheet.create({
    logo:{
        backgroundColor: 'transparent',
        alignSelf:'center',
        // flex:1,
        resizeMode: 'contain',
        marginTop:20
    },
    btnContainer:{
        backgroundColor: myColor.red,
          justifyContent:'center',
          flex:1,
          borderRadius:10,
      },
    txtInp:{
        borderRadius:10,
        color:'#000000',
        backgroundColor:'#ffffff66',
        fontSize:18,
        borderColor:myColor.red,
        padding:6,
      },
      scrollView: {
        backgroundColor: 'transparent',
        borderRadius:5,
      },
      error:{
          color:'red',
          fontWeight:'300',
      },
      container: {
        // marginVertical: 20,
        paddingHorizontal: 24,
      },
      linearGradient: {
        flex:1,
      },
      fieldTxt:{
        fontSize: 16,
      paddingRight:5,
      color: myColor.darkBlue,
      marginTop:18,marginBottom:8
      }
});