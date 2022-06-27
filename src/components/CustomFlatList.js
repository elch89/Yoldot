import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Icon,IconButton ,HStack, Heading , Box, Center } from 'native-base';
import myColor from '../styles/colors'
import { FontAwesome } from '@expo/vector-icons';
// import  Icon  from 'react-native-vector-icons/FontAwesome';
  const Item = ({ item, onPress, iconColor }) =>(
    <TouchableOpacity onPress={onPress} style={[styles.item, ]}>
      <Text style={[styles.title, {paddingHorizontal:18}]}>{item.val}</Text>
      <FontAwesome name='check-circle-o'  color={iconColor.iconColor} size={48}/>
    </TouchableOpacity>
  );
function CustomList(props){
    const [selectedId, setSelectedId] = useState(null);
    const {qType, data, initialSelected, itemsSelected} = props;
    const isMulti = (qType==="checkbox")?true:false;
    // initial selected is array of aid
    const renderItem = ({ item }) => {
        const iconColor = item.aid === selectedId ? myColor.darkBlue : '#0000003a';
        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.aid)}
                iconColor={{iconColor}}
            />
        );
    };

    return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.aid}
        extraData={selectedId}
      />
    </SafeAreaView>
  );};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
      flexDirection:"row"
    },
    title: {
        fontWeight:'bold',fontSize:28, 
    },
  });    
export default CustomList;