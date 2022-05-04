import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
export default class BrowsePodcasts extends React.Component{
    onPressItem=(title)=> {
        var data = {
            selectedFragment: 2,
            title: title
        }
        this.props.callbackFromParent(data);
    }
    render(){
        return <FlatList data={[{key:1,title:'pod 1'},{key:2,title:'pod 2'},{key:3,title:'pod 3'},{key:4,title:'pod 4'}]}
        renderItem={({ item }) => <TouchableWithoutFeedback onPress={() =>  this.onPressItem(item.title)}>
            <View style={styles.item}><Text style={styles.title}>{item.title}</Text></View>
            </TouchableWithoutFeedback>}
        keyExtractor={item => item.id}
        />
    }
}

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#fff543',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });