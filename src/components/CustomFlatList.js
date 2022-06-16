import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  // Text,
  TouchableOpacity,
} from 'react-native'
import { Text,Pressable,HStack, Spacer , NativeBaseProvider, Box, Center } from 'native-base';
import myColor from '../styles/colors'
import { FontAwesome } from '@expo/vector-icons';
// import  Icon  from 'react-native-vector-icons/FontAwesome';
  const Item = ({ item, onPress, iconColor }) =>(
    <Pressable onPress={onPress} bg="coolGray.300"><Box p="5" maxW="96"><HStack alignItems={"center"}>
     <Text fontSize={28} fontWeight="bold">{item.val}</Text>
     <Spacer/>
      <FontAwesome name='check-circle-o'  color={iconColor.iconColor} size={48}/>
      </HStack></Box></Pressable>
  );
function CustomList(props){
    const [selectedId, setSelectedId] = useState(null);
    const {qType, data, initialSelected, itemsSelected} = props;
    const isMulti = (qType==="checkbox")?true:false;
    // itemsSelected([data[1]])
    // console.log(initialSelected)
    
    // initial selected is array of aid
    const renderItem = ({ item }) => {
      
        const iconColor = item.aid === selectedId ? myColor.darkBlue : '#0000003a';
        // if(initialSelected.length>0){
        //   const itr = initialSelected.filter((id)=>id===item.aid);
        //   console.log(itr)
        //   setSelectedId(itr.shift())
        // }
        return (
            <Item
                item={item}
                onPress={() => {setSelectedId(item.aid); itemsSelected([item])}}
                iconColor={{iconColor}}
            />
        );
    };

    return (<NativeBaseProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.aid}
        extraData={selectedId}
      />
    </SafeAreaView></NativeBaseProvider>
  );};
//     const {qType, data, initialSelected, itemsSelected} = props
//     const [selectedItems, setSelectedItem] = useState([]);
//     // var boolList=Array(data.length).fill(false);// []...false
//     // for (var i =0;i<initialSelected.length;i++){// sets boollist according to initial
//     //     boolList[initialSelected[i]]=true;
//     // }
    
//     useEffect(()=>{// on component mount set initial selected
//         if(initialSelected.length == 0){
//             setSelectedItem([])
//         }
//         else{
//             const itemSelected = [];
//             data.forEach((element, i) => {
//                 const itemIndexFound = lodash.find(initialSelected,
//                     (item) => (item === i));
//                 if (typeof itemIndexFound === 'number') {
//                     itemSelected.push(element);
//                 }
//             });
            
//             setSelectedItem(itemSelected)
//         }
        
//     },[itemsSelected]);
//     const [choiceArr, setChoiceArr] = useState(Array(data.length).fill(false))// state to save boolean array
//     console.log('in custom list: '+selectedItems)
//     return (
//     <View>
//         <ListContainer 
//             selectedItems = {selectedItems}// state for users choices
//             itemsSelected = {select=>itemsSelected(select)}// function for fathers action (PostBirthQuestionnare)
//             type = {qType} // type of question
//             data={data} // data to fill objects renderd
//             choiceArr={choiceArr}
//             initialSelected={initialSelected}
//             setChoiceArr={selection =>setChoiceArr(selection)}
//             ></ListContainer>  
//     </View>);
// }

// const ListContainer = ((props) =>{
//     const {type, data, choiceArr,setChoiceArr,initialSelected, itemsSelected, selectedItems} = props
//     var boolList=Array(data.length).fill(false);// []...false
//     for (var i =0;i<initialSelected.length;i++){// sets boollist according to initial
        
//         boolList[initialSelected[i]]=true;
//     }
    
//     const renderItem = ({item})=>{
//         return <ListItem 
//                     item={item} 
//                     type={type} 
//                     setChoiceArr = {selection =>setChoiceArr(selection) } 
//                     choiceArr={choiceArr}
//                     selectedItems={selectedItems}
//                     itemsSelected = {value =>itemsSelected(value)} 
//                     />
//     };
//     return (<View style={{}}><FlatList
//         data ={data} 
//         renderItem ={renderItem}
//         keyExtractor = {item => item.aid.toString()}
//         extraData={choiceArr}
//     />
//     </View>
// )});


// const ListItem = ((props) =>{
//     const {item,type, setChoiceArr, choiceArr, itemsSelected, selectedItems} = props
//     const isItemSelected = () => {
//         const itemSelected = lodash.find(selectedItems,
//           (element) => (element === item.aid));
//           console.log(itemSelected)
//         if (itemSelected) {
//           return true;
//         }
//         return false;
//     }
    
//     const onItemSelected = () =>{
//         if(type == 'checkbox'){//more then one to select
//             choiceArr[item.aid] = !choiceArr[item.aid];
//             setChoiceArr(choiceArr);
            
//         }
//         else{//reset array ( <not multiple>)
//             // choiceArr[item.aid] = !choiceArr[item.aid];
//             // setChoiceArr(choiceArr);
//             selectedItems.push(item);    
//             itemsSelected(selectedItems);
//         }
        
//     };

//     return (<TouchableOpacity style={styles.rowItem}
//         onPress={onItemSelected}
//     >
//         <Icon name='check-circle-o' color={isItemSelected() ?myColor.darkBlue:myColor.white} size={48}/>
//         <Text style={{fontSize:18}}>{item.val}</Text>
//     </TouchableOpacity>)}
// );

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignContent:'center',
        // alignItems: 'flex-start',
        paddingHorizontal: 30,
      flexDirection:"row"
    },
    title: {
        fontWeight:'bold',fontSize:28, 
    },
  });    
// const styles = StyleSheet.create({
//     rowItem:{
//         backgroundColor:'transparent',
//         paddingHorizontal:18,
//         flex:1, 
//         flexDirection:'row',
//     },
// });
export default CustomList;