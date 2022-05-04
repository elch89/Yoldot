import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Animated,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { CommonActions} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'

export default class Register extends React.Component{
    constructor(){
        super();
        this.state = {
            email:null,
            password:null,
            username:null,
            isTheSame:false,
            varifypassword:null,
            isValid:false,
            errorEmail:1,
            errorPasword:1,
            errorUser:1,
            uErrorVisible:false,
            pErrorVisible:false,
            eErrorVisible:false,
        };
        // refs for data providing keyboard focusing
        this.ref_email = React.createRef();
        this.ref_pass1 = React.createRef();
        this.ref_pass2 = React.createRef();
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
    userSignup() {
        // if (!this.state.email || !this.state.password || !this.state.username || !this.state.isTheSame) {
        //     Alert.alert('שגיאה','יש למלא את כל השדות');
        //     return;
        // }
        //  verify legit input...
        let error = false;
        if (!this.validateInput(this.state.email,'email')) {
            this.setState({ errorEmail:3, eErrorVisible:true})  
            error = true;          
        }
        if (!this.validateInput(this.state.password,'password')){
            Alert.alert('שגיאה','הסיסמה צריכה להיות לפחות באורך 6 ובאנגלית, להכיל אותיות קטנות, אותיות גדולות ומספרים',
                    [{ text: "חזרה", style: 'cancel', onPress: () => {} },]
                );
            this.setState({ errorPasword:3})
            error = true; 
        }
        if(!this.validateInput(this.state.username, 'user')){
            this.setState({errorUser:3, uErrorVisible:true})
            error = true; 
        }
        if (!this.state.email || !this.state.password || !this.state.username || !this.state.isTheSame) {
            Alert.alert('שגיאה','יש למלא את כל השדות');
            error = true;
        }
        if(error){return;}
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        let fd = new FormData()
        fd.append('email',this.state.email);
        fd.append('password', this.state.password);
        fd.append('name',this.state.username); 
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
            console.log(responseData) ///
            if(responseData.error == true){
                Alert.alert('שגיאה',responseData.error_msg)
            }
            else{
                Alert.alert('הרשמה','תודה שנרשמת לאפליקציה\n\nנשלח לך אימייל אימות, יש לבצע אימות על מנת להתחבר למשתמשת')
                // Should be varification first
                this.props.navigation.dispatch(resetAction)
            }
          
        })
        .done();
      }
    render(){
        const { width, height ,uri} = Image.resolveAssetSource(require('../../assets/img/yoldot_logoT.png'));
        return(
            <>  
                <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                            locations={[0,0.1,0.7,1]}
                            style={styles.linearGradient}>
                    <View style = {[styles.logo,{opacity:this.state.imageOpacity}]}><Image source={require('../../assets/img/yoldot_logoT.png')} /></View>
                    <ScrollView 
                        ref={(ref)=>this._scrollView = ref} // add reference for scrollView
                        style={[styles.scrollView,]}//{marginTop:height}
                        >
                        <SafeAreaView style={{paddingTop:height}}>
                        
                        <View style = {[styles.container,]}>
                            
                            <Text style = {styles.fieldTxt}>שם</Text>
                            <TextInput
                                editable={true}
                                onChangeText={(username) => this.setState({username})}
                                placeholder='Username'
                                ref='name'
                                onSubmitEditing={() => this.ref_email.current.focus()}
                                returnKeyType='next'
                                value={this.state.username} 
                                style={[styles.txtInp,{borderWidth:this.state.errorUser}]}/>
                            {this.state.uErrorVisible && <View ><Text style = {styles.error}>*שם משתמש צריך להכיל לפחות 3 תווים</Text></View>}
                            <View style={{marginBottom:10}}></View>
                            <Text style = {styles.fieldTxt}>אי מייל</Text>
                            <TextInput 
                                editable={true}
                                onChangeText = {(email)=>
                                    {
                                        this.setState({email});
                                    }
                                }
                                placeholder = 'example@example.com'
                                onSubmitEditing={() => this.ref_pass1.current.focus()}
                                ref={this.ref_email}
                                returnKeyType='next'
                                value = {this.state.email}
                                keyboardType='email-address' 
                                textContentType='emailAddress' 
                                style={[styles.txtInp,{borderWidth:this.state.errorEmail}]}/>
                            {this.state.eErrorVisible && <View><Text style = {styles.error}>*אימייל לא תיקני</Text></View>}
                            <View style={{marginBottom:10}}></View>
                            <Text style = {styles.fieldTxt}>סיסמה</Text>
                            <TextInput 
                                editable={true}
                                onChangeText={(password) => this.setState({password})}
                                placeholder='Password'
                                onSubmitEditing={() => this.ref_pass2.current.focus()}
                                ref={this.ref_pass1}
                                returnKeyType='next'
                                value={this.state.password}
                                textContentType='password' 
                                secureTextEntry={true} 
                                autoCorrect={false}
                                autoCapitalize='none'
                                style={[styles.txtInp,{borderWidth:this.state.errorPasword, marginBottom:10}]}/>
                            <Text style = {styles.fieldTxt}>אימות סיסמה</Text>
                            <TextInput 
                                onChangeText={(password) => this.comparePasswords(password)}
                                editable={true}
                                ref={this.ref_pass2}
                                style={[styles.txtInp,{borderWidth:this.state.errorPasword,}]} 
                                textContentType='password' 
                                placeholder='Password'
                                returnKeyType='next'
                                value={this.state.varifypassword}
                                secureTextEntry={true}
                                autoCorrect={false}
                                autoCapitalize='none' />
                            {this.state.pErrorVisible && <View><Text style = {styles.error}>*סיסמאות לא זהות</Text></View>}
                            <View style={{marginBottom:10}}></View>
                            <TouchableOpacity 
                            style = {styles.btnContainer}
                            onPress={this.userSignup.bind(this)}
                            >
                                <View style={{justifyContent:'center'}}
                            //  onLayout={(event) => {
                            //   var {x, y, width, height} = event.nativeEvent.layout;
                            //   console.log('width: '+width + ',  height: ' + height);
                            // }}
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
            </>
        )
    }
    comparePasswords(str){
        if(str === this.state.password){
            this.setState({isTheSame:true, errorPasword:1,pErrorVisible:false})
        }
        else{ 
            this.setState({isTheSame:false, errorPasword:3,pErrorVisible:true}) 
        }
    }
    validateInput = (inp, type) => {
        var re = null;
        if(type === 'email'){
            re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        };
        if(type === 'password'){
            re = /^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
        };
        if(type === 'user'){
            re = /^(?=.{3,})/
        }
        if(re == null) return;
        return re.test(inp); 

    }
}
const styles = StyleSheet.create({
    logo:{
        backgroundColor: 'transparent',
        alignSelf:'center',
        position:'absolute',
        
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
        marginVertical: 20,
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