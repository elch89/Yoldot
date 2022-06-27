import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
} from 'react-native';
import PlayingNow from './PlayingNow';
export default class NewPodcasts extends React.Component{
    render(){
        return (<ScrollView>
            <React.Fragment>
                <PlayingNow/>
                <View style ={{borderBottomColor: '#737373', borderBottomWidth: StyleSheet.hairlineWidth,}}></View>
                <PlayingNow/>
                <View style ={{borderBottomColor: '#737373', borderBottomWidth: StyleSheet.hairlineWidth,}}></View>
                <PlayingNow/>

            </React.Fragment>
            </ScrollView>)
    }
}