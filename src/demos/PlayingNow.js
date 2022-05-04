import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
export default class PlayingNow extends React.Component{
    render(){
        return (<View style={{flex:1}}>
            <Image source={require('../../assets/img/socialBus.jpeg')} style={styles.pic}/>
            <View style={styles.txtContainer}><Text>Date</Text></View>
            <View style={styles.txtContainer}><Text>Description</Text></View>
            
            <View style={styles.tabs}>
                        <TouchableOpacity style={styles.button} onPress={()=>{alert()}}>
                            <Text style={styles.txt}>נגן</Text>
                        </TouchableOpacity >   
                        <TouchableOpacity style={styles.button} onPress={()=>{alert()}}>
                            <Text style={styles.txt}>עצור</Text>
                        </TouchableOpacity >  
                    </View>   
            </View>);
    }
}

const styles = StyleSheet.create({
    pic:{
        backgroundColor: '#fff',
        alignSelf:'center',
        marginTop:20,
        width:140,
        height:200
    },
    txtContainer:{
        marginVertical:10,
        padding:15,
        borderWidth:1,
     
        borderColor:'#000'

    },
    button: {
        flex:1,
        alignSelf:'stretch',
        borderColor:'#111fff',
        borderWidth:1,
      },
    txt:{
        textAlign:'center', 
        padding: 10,
        color: 'red',
        fontSize: 17,
    },
    tabs:{
        height:'10%',
        flexDirection: 'row',
        marginVertical:20,
    },
})