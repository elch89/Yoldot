import React , {Component, useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'

function Login(props){
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [eBoxWidth, setEBoxWidth] = useState(1); //emailBoxWidth
  const [eErrorVisible, setEErrorVisible] = useState(false);
  const [imageOpacity,setImageOpacity] = useState(1);
  const ref_email = useRef(null);

  useEffect(()=>{// add listeners for keyboard on component mount
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {setImageOpacity(0.5)});
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {setImageOpacity(1)});
    return () =>{// remove listeners 
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  },[]);
  async function saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  const validateInput=(input)=>{
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
  }
  const userLogin = () => {
    // empty fields and verify
    if (!email || !password ){ 
      Alert.alert('שגיאה','יש למלא את כל השדות');
      return;
    }
    if( !validateInput(email)){
      setEBoxWidth(3);
      setEErrorVisible(true);
    }
    // create post parameters
    let fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);
    // navigation config
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    fetch(connection.URL+'login.php', {
      method: 'POST', 
      headers: { Accept: 'application/json', 
      'Content-Type': 'multipart/form-data' },
      body: fd, 
    })
    .then((response) => response.json())
    .then((responseData) => {
      // show error messege - mostly user doesnt exist 
      if(responseData.error == true){
        Alert.alert('שגיאה',responseData.error_msg)
    }
    else{
      saveItem('id_token', responseData.uid),
      saveItem('email', responseData.user.email)
      saveItem('user_name', responseData.user.name)
      props.navigation.dispatch(resetAction)
    }
    }).catch((error)=>Alert.alert('שגיאה','יש לבדוק את חיבור האינטרנט'))
    .done();
  }
  const passwordReset = () =>{
    if (!email){ 
      Alert.alert('שגיאה','יש להכניס אימייל ');
      return;
    }
    // create post parameters
    let fd = new FormData();
    fd.append('email',email);
    fetch(connection.URL+'newpass.php', {
      method: 'POST', 
      headers: { Accept: 'application/json', 
      'Content-Type': 'multipart/form-data' },
      body: fd, 
    })
    .catch((error)=>Alert.alert(error))
    .finally(()=>Alert.alert('איפוס סיסמה','שלחנו לך אימייל לאיפוס סיסמה '))
    .done();
  }
  return (
        <SafeAreaView style={{flex:1}}>  
            
            <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                            locations={[0,0.1,0.7,1]}
                            style={styles.linearGradient}
                            >
                
            <ScrollView
                style={[styles.scrollView,]}
                >
                  <Image source={require('../../assets/img/yoldot_logoT.png')} style={[styles.logo,{opacity:imageOpacity}]}/>
                  <SafeAreaView >
                    
                    {/* navigate to register screen */}
                  <TouchableOpacity 
                    style = {[styles.btnContainer,{marginHorizontal:20, }]}
                    onPress={()=>{props.navigation.navigate('Register')}}>
                    <View
                     
                     style={{justifyContent:'center'}}>
                      <Text style={styles.btnActions}>
                          {'להרשמה'}
                      </Text>
                    </View>
                  </TouchableOpacity> 
                    {/* divider */}
                  <View style ={{marginVertical: 20,borderBottomColor: '#737373', borderBottomWidth: StyleSheet.hairlineWidth,}}/>
                  <View style={styles.sectionContainer}>
                    <Text style={{alignSelf:'center',fontSize:24,color:myColor.darkBlue, fontWeight: 'bold',}}>
                        משתמשת רשומה
                    </Text>
                  <View>
                    <Text style = {styles.fieldTxt}>אימייל</Text>
                        <TextInput 
                          onSubmitEditing={()=>{ref_email.current.focus()}}
                          editable={true}
                          onChangeText = {(email)=> setEmail(email)}
                          placeholder = 'example@example.com'
                          returnKeyType='next'
                          value = {email}
                          keyboardType='email-address' 
                          textContentType='emailAddress' 
                          style={[styles.txtInp,{borderWidth:eBoxWidth}]}/>
                          {eErrorVisible && <View><Text style = {{color:'red'}}>*אימייל לא תיקני</Text></View>}
                      <Text 
                            style = {styles.fieldTxt}>סיסמא</Text>
                        <TextInput 
                          onSubmitEditing={Keyboard.dismiss}
                          ref = {ref_email}
                          editable={true}
                          onChangeText={(password) => setPassword(password)}
                          placeholder='Password'
                          returnKeyType='next'
                          value={password}
                          textContentType='password' 
                          secureTextEntry={true}  
                          autoCorrect={false}
                          autoCapitalize='none'
                          style={[styles.txtInp,{marginBottom:30,}]}/>
                      {/**login... */}
                      <View style = {{marginBottom:20}}>
                        <TouchableOpacity 
                          style = {styles.btnContainer}
                          onPress={  userLogin }>
                          <View 
                            style={{justifyContent:'center'}}>
                            <Text style={styles.btnActions}>
                                {'לכניסה'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                        <TouchableOpacity 
                        onPress={passwordReset}  
                        >
                          <Text style={{alignSelf:'center',fontSize:16,fontWeight:'bold', color: myColor.black, paddingBottom:28}}>שכחתי את הסיסמא
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    </SafeAreaView>
            </ScrollView>
            </LinearGradient>
           
        </SafeAreaView>
        )
}
export default Login;

const styles = StyleSheet.create({
    logo:{
      backgroundColor: 'transparent',
      alignSelf:'center',
      // position:'absolute',
      marginTop:32,
      flex:1,
      resizeMode: 'contain',
      
    },
    btnContainer:{
      backgroundColor: myColor.red,
        justifyContent:'center',
        flex:1,
        borderRadius:10,
    },
    txtInp:{
      borderRadius:10,
      flex:1,
      borderWidth:1,
      backgroundColor:'#ffffff66',
      borderColor:myColor.red,
      fontSize:18,
      color:'#000000',
      padding:6
    },
    scrollView: {
      backgroundColor: 'transparent',
      borderRadius:5,
      flexGrow: 1, flexShrink: 1,
    },

    sectionContainer: {
      paddingHorizontal: 24,
    },
    linearGradient: {
      flex: 1,
    },
    fieldTxt:{
      fontSize: 16,
      paddingRight:5,
      color: myColor.darkBlue,
      marginTop:18,marginBottom:8
    },
    btnActions:{
      textAlign:'center', 
      color: 'white', 
      fontSize:18,
      padding: 12
    }
  });