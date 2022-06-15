import React from 'react';
import {
    View,
    Text,
    FlatList,
} from 'react-native';
import myColor from '../styles/colors';
/** details of info on Compare class */
const Details = (props)=>{
    const Seperator =()=>(
        <View style ={{marginHorizontal:2,marginVertical:5,borderEndColor: myColor.darkBlue, borderEndWidth: 7, borderRadius:5}}/>);
    return(
        <FlatList 
        showsVerticalScrollIndicator={false}
        horizontal={false}
        contentContainerStyle={{borderRadius:20,}}
            data={props.dataPass}
    renderItem={({ item }) =>
    <View style = {{flex:1}}>
        <View style = {{backgroundColor:myColor.darkBlue, borderRadius:5}}>
            <Text style={
                {
                    textAlign:'center',
                    fontSize:18,
                    color:'#fff',
                    paddingHorizontal:10,
                }
            }
            >{item.subCat} </Text></View>
            <View  style={{
                    flexDirection:'row',
                    // flex:1,
                    // justifyContent:'center',
                    }}>
                {item.describe.map((value,i)=>{
                   return( 
                        <View key={i} style={{flex:1,flexDirection:'row',justifyContent:'center',}}>
                            <Text style={{textAlign:'center',alignSelf:'center',flex:1, fontSize:18, paddingVertical:10}}>
                                {value}
                            </Text>
                            {(i==0 && item.describe.length == 2) && <Seperator/>}
                        </View>
                    )})
                }
            </View>
        </View>
    }
    keyExtractor={item => item.cid.toString()}></FlatList>
        
    );
};
export default Details;