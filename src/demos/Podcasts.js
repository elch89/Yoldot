import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity ,
    StyleSheet,
} from 'react-native';
import NewPodcasts from '../demos/NewPodcasts'
import BrowsePodcasts from './BrowsePodcasts'
import PlayingNow from '../demos/PlayingNow'
// import { TouchableHighlight } from 'react-native-gesture-handler';

export default class Podcasts extends React.Component{
    constructor (props) {
        super(props)
        this.state = {
          selectedFragment: 0,
        }
    }
    myCallback = (dataFromChild) => {
        this.setState({ selectedFragment: dataFromChild.selectedFragment });
    }
    updateFragment(selectedFragment){
        this.setState({selectedFragment: selectedFragment})
    }
    renderFragments(){
        if(this.state.selectedFragment===0){
            return <NewPodcasts/>;
          }
          else if(this.state.selectedFragment===1){
            return <BrowsePodcasts callbackFromParent={this.myCallback}/>;
          }
          else if(this.state.selectedFragment===2){
            return <PlayingNow />;
          }
    }
    render(){
        const {selectedFragment} = this.state
        return(
            <SafeAreaView style={{flex:20}}>
                <View style={styles.container}>
                    <View style={styles.tabs}>
                        <TouchableOpacity style={styles.button} onPress={()=>{this.updateFragment(0)}}>
                            <Text style={styles.txt}>חדש</Text>
                        </TouchableOpacity >   
                        <TouchableOpacity style={styles.button} onPress={()=>{this.updateFragment(1)}}>
                            <Text style={styles.txt}>רשימת פודקאסטים</Text>
                        </TouchableOpacity >  
                    </View>    
                    <View style={{paddingTop:10, flex:1}}>
                        <React.Fragment >
                            {this.renderFragments()}
                        </React.Fragment>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    tabs:{
        height:'8%',
        flexDirection: 'row',
        marginVertical:20,
    },
    container:{
        // backgroundColor:'#fff',
        padding:15,
        margin:10,
        alignItems:'stretch',
        borderColor:'#111fff',
        borderWidth:1,
        flex:1,
        flexDirection:'column'
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
    }
});