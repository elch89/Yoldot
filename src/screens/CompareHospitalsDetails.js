import React from 'react';
import {
    View,
    Text,
    FlatList,
} from 'react-native';
import myColor from '../styles/colors';
/** details of info on Compare class */
const Details = (props)=>{
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
        <View style={{
            justifyContent:'center',
            flexDirection:'row',
            flex:1,
            }}>
            <Text style={{textAlign:'center',alignSelf:'center',flex:1, fontSize:18,
                        paddingVertical:10
                        }}>{item.describe[0]}</Text>
            <View style ={{
                margin:5,borderEndColor: myColor.darkBlue, borderEndWidth: 7, borderRadius:5
                }}/>
            <Text style={{textAlign:'center',alignSelf:'center',flex:1, fontSize:18,
                    paddingVertical:10
                }}>{item.describe[1]}</Text>
        </View>
        </View>
    }
    keyExtractor={item => item.cid.toString()}></FlatList>
        
    );
};
export default Details;