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
import { Alert as NbAlert, HStack, useToast, Box } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors';
import {connection} from '../data/DataSource';
// import { LoginButton, AccessToken, Profile,LoginManager  } from 'react-native-fbsdk-next'

function Login(props){
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [eBoxWidth, setEBoxWidth] = useState(1); //emailBoxWidth
  const [eErrorVisible, setEErrorVisible] = useState(false);
  const [imageOpacity,setImageOpacity] = useState(1);
  const [btnPressed, setBtnPressed] = useState(false);
  const ref_email = useRef(null);
  const toast = useToast();
  
  useEffect(()=>{// add listeners for keyboard on component mount
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {setImageOpacity(0.5)});
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {setImageOpacity(1)});
    return () =>{// remove listeners 
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  },[]);
  // async function currentProfile(){ Profile.getCurrentProfile().then(
  //   function(currentProfile) {
  //     console.log(currentProfile)
  //     if (currentProfile) {
  //       console.log("The current logged user is: " +
  //         currentProfile.name
  //         + ". His profile id is: " +
  //         currentProfile.userID
  //       );
  //     }
  //   }
  // );}
  // function fbLog(){ LoginManager.logInWithPermissions(["public_profile","email"]).then(
  //   function(result) {
  //     if (result.isCancelled) {
  //       console.log("Login cancelled");
  //     } else {
  //       console.log(
  //         "Login success with permissions: " +
  //           result.grantedPermissions.toString()
  //       );
        
  //       AccessToken.getCurrentAccessToken().then(
  //         (data) => {
  //           const resetAction = CommonActions.reset({
  //             index: 0,
  //             routes: [{ name: 'Home' }],
  //           });
            
  //           saveItem('id_token', data.accessToken.toString()),
  //           saveItem('email', 'sddd')
  //           saveItem('user_name', 'currentProfile')
  //           // props.navigation.dispatch(resetAction)
  //           console.log(data.accessToken.toString())
  //         });
  //     }
  //   },
  //   function(error) {
  //     console.log("Login fail with error: " + error);
  //   }
  // ).finally((_)=>currentProfile().then().catch((e)=>console.log(e)));}
  async function saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
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
  const validateInput=(input)=>{
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
  }
  const userLogin = () => {
    // empty fields and verify
    if (!email || !password ){
      toastMessege('יש למלא את כל השדות')
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
    }).catch((error)=>toastMessege('יש לבדוק את חיבור האינטרנט '))//Alert.alert('שגיאה','יש לבדוק את חיבור האינטרנט'))
    .done();
  }
  const passwordReset = () =>{
    if (!email){ 
      toastMessege('יש להכניס אימייל ')
      // Alert.alert('שגיאה','יש להכניס אימייל ');
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
                            style={{flex:1}}
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
                        {/* <TouchableOpacity 
                          style = {styles.btnContainer}
                          onPress={ ()=>{fbLog()} }>
                          <View 
                            style={{justifyContent:'center'}}>
                            <Text style={styles.btnActions}>
                                {'Facebook'}
                            </Text>
                          </View>
                        </TouchableOpacity> */}
                        {/* <LoginButton
                          
                            onLoginFinished={
                            (error, result) => {
                            if (error) {
                              console.log("login has error: " + result.error);
                            } else if (result.isCancelled) {
                              console.log("login is cancelled.");
                            } else { 
                            AccessToken.getCurrentAccessToken().then(
                            (data) => {
                              const resetAction = CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                              });
                              console.log(LoginManager.getLoginBehavior().then())
                              saveItem('id_token', data.accessToken.toString()),
                              saveItem('email', 'sddd')
                              saveItem('user_name', 'currentProfile')
                              // props.navigation.dispatch(resetAction)
                              console.log(data.accessToken.toString())
                            }
                                  )
                                }
                              }
                            }
                            onLogoutFinished={() => console.log("logout.")}/> */}
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