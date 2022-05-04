import React , {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'


class Login extends Component {
  constructor(){
    super();
    
    
    this.state = {
      email:null,
      password:null,
      emailBoxWidth:1,
      eErrorVisible:false,
      imageOpacity:1,
    };
    // create reference for email in field, used for keyboard focusing on form submition
    this.ref_email = React.createRef();
  }
  // add listeners for keyboard on component mount
  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  // remove listeners  
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  // actions to do when listeners are trigered - change opacity  
  _keyboardDidShow = () => {
    this.setState({imageOpacity:0.5})
  }
    
  _keyboardDidHide = () => {
    this.setState({imageOpacity:1});
  }
  //save the received id token for persistence
  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  validateInput=(input)=>{
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
  }
  userLogin() {
    // empty fields and verify
    if (!this.state.email || !this.state.password ){ 
      Alert.alert('שגיאה','יש למלא את כל השדות');
      return;
    }
    if( !this.validateInput(this.state.email)){
      this.setState({ emailBoxWidth:3, eErrorVisible:true})  
    }
    // TODO: verify legit input, and dont allow sending bad input
    // create post parameters
    let fd = new FormData();
    fd.append('email',this.state.email);
    fd.append('password', this.state.password);
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
      this.saveItem('id_token', responseData.uid),
      this.saveItem('email', responseData.user.email)
      this.saveItem('user_name', responseData.user.name)
      this.props.navigation.dispatch(resetAction)
    }
    }).catch((error)=>Alert.alert('שגיאה','יש לבדוק את חיבור האינטרנט'))
    .done();
  }
  passwordReset(){
    if (!this.state.email){ 
      Alert.alert('שגיאה','יש להכניס אימייל ');
      return;
    }
    // create post parameters
    let fd = new FormData();
    fd.append('email',this.state.email);
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
    render(){
      const { width, height ,uri} = Image.resolveAssetSource(require('../../assets/img/yoldot_logoT.png'));// extract image
        return (
        <>  
            
            <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                            locations={[0,0.1,0.7,1]}
                            style={styles.linearGradient}
                            >
                              <View style={[styles.logo,{opacity:this.state.imageOpacity}]}><Image source={require('../../assets/img/yoldot_logoT.png')} /></View>
            <ScrollView
            // keyboardDismissMode='none' scrollEnabled={false}
              ref={(ref)=>this._scrollView = ref} // add reference for scrollView
                style={[styles.scrollView,]}
                >
                  <SafeAreaView style={{paddingTop:height+20}}>
                    
                    {/* navigate to register screen */}
                  <TouchableOpacity 
                    style = {[styles.btnContainer,{marginHorizontal:20, }]}
                    onPress={()=>{this.props.navigation.navigate('Register')}}>
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
                          editable={true}
                          onChangeText = {(email)=> this.setState({email})}
                          placeholder = 'example@example.com'
                          onSubmitEditing={()=>{this.ref_email.current.focus()}}
                          returnKeyType='next'
                          value = {this.state.email}
                          keyboardType='email-address' 
                          textContentType='emailAddress' 
                          style={[styles.txtInp,{borderWidth:this.state.emailBoxWidth}]}/>
                          {this.state.eErrorVisible && <View><Text style = {{color:'red'}}>*אימייל לא תיקני</Text></View>}
                      <Text 
                            style = {styles.fieldTxt}>סיסמא</Text>
                        <TextInput 
                          editable={true}
                          onChangeText={(password) => this.setState({password})}
                          placeholder='Password'
                          ref={this.ref_email}
                          returnKeyType='next'
                          value={this.state.password}
                          textContentType='password' 
                          secureTextEntry={true}  
                          autoCorrect={false}
                          autoCapitalize='none'
                          style={[styles.txtInp,{marginBottom:30,}]}/>
                      {/**login... */}
                      <View style = {{marginBottom:20}}>
                        <TouchableOpacity 
                          style = {styles.btnContainer}
                          onPress={  
                            this.userLogin.bind(this)
                            }>
                          <View 
                            style={{justifyContent:'center'}}>
                            <Text style={styles.btnActions}>
                                {'לכניסה'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {/** TODO: implement in server */}
                        <TouchableOpacity 
                        onPress={this.passwordReset.bind(this)}  
                        >
                          <Text style={{alignSelf:'center',fontSize:16,fontWeight:'bold', color: myColor.black, paddingBottom:28}}>שכחתי את הסיסמא
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    </SafeAreaView>
            </ScrollView>
            </LinearGradient>
           
        </>
        )
    }
}

     
const styles = StyleSheet.create({

    logo:{
      backgroundColor: 'transparent',
      alignSelf:'center',
      position:'absolute',
      marginTop:32,
      
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
export default Login;