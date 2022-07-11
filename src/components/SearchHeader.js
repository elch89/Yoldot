import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Image,
} from 'react-native';
import {Select, Center, CheckIcon,Box} from 'native-base'
import myColor from '../styles/colors'

const SearchBox = (props) =>{
  const [selectedItems,setSelectedItems] = useState([]);
  const [placeholder, setPlaceholder] = useState("")

  const sendToParent =() =>props.callbackFromParent(selectedItems);
  const togglePlaceholder=()=>(selectedItems.length===1)?setPlaceholder('בחרי בית חולים שני'):setPlaceholder('בחרי בית חולים ראשון להשוואה')
  useEffect(()=>{sendToParent();togglePlaceholder()},[selectedItems]);

  const renderSelected=()=>{
    let selectedArray = Array()
    const color =[myColor.lightBlue, "#E48598"]
    selectedItems.map((n,i)=>{
      selectedArray.push(<TouchableOpacity 
                            key={i} 
                            style={[styles.selected, {backgroundColor:color[i]}]} 
                            onPress={()=>{
                              const items = selectedItems.filter((sitem) => sitem.id !== n.id);
                              setSelectedItems(items);
                            }}>
                            <Text style={{textAlign:'center', paddingHorizontal:10, fontSize:18}}>{n.name}</Text>
                            <Image style={
                              {width: 20,height: 20,position: 'absolute',left: 0,right: 0,top: 0,bottom: 0,padding:10,}
                            } 
                            source={require('../../assets/img/error.png')}></Image>
                            </TouchableOpacity>)
    })
    return selectedArray
  }

  if(selectedItems.length<2){
    return(
      <Center flex={1} >
        <Select borderColor={myColor.darkBlue} 
          _actionSheetContent={
            {disableOverlay:true}
          }
          fontWeight="bold"
          fontSize={"lg"} 
          textAlign="center" 
          selectedValue="selected"
          w={"90%"}
          accessibilityLabel="בחרי בית חולים" 
          placeholder={placeholder}
          _selectedItem={{
            bg: myColor.lightBlue,
            endIcon: <CheckIcon size="6" color={myColor.red}/>}} 
          mt={1} 
          onValueChange={(value)=>{
            var entry = props.hospitals.filter((sitem) => sitem.id === value)
            
            setSelectedItems(selectedItems=>[...selectedItems,entry[0]]);
          }}>
          {props.hospitals.map((item,i) =>  
                                    (<Select.Item label={item.name} value={item.id} key={i}/>)
                                )} 
        </Select>
        <Box flexDirection={'row'} flexWrap={"wrap"} alignContent="space-between">{renderSelected()}</Box>
      </Center >);
  }
  else{
    return (<Box flexDirection={'row'} flexWrap={"wrap"} alignContent="space-between">{renderSelected()}</Box>);
  }
}
export default SearchBox;


const styles = StyleSheet.create({

  selected:{
    justifyContent:'center',
    // alignContent:'center',
    flexDirection:'row',
    // minHeight:48,
    flex:1,
    borderColor:'black',
    borderWidth:1,
    borderRadius:10,
    padding:5,
    margin:2
  },
});