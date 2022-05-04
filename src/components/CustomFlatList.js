// import React, { useCallback, useEffect, useState } from 'react';
// import lodash from 'lodash';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     FlatList,
//     Button,
// } from 'react-native'
// import PropTypes from 'prop-types';
// import myColor from '../styles/colors'
// import  Icon  from 'react-native-vector-icons/FontAwesome';
// CustomList.propTypes ={
//     data:PropTypes.array,
//     qType:PropTypes.string,
//     initialSelected:PropTypes.any,
//     itemsSelected:PropTypes.func,
// }
// CustomList.defaultProps = {
//     initialSelected:[],
//     data:[],
// }
// // PASS data back to father // TODO
// function CustomList(props){
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

    
// const styles = StyleSheet.create({
//     rowItem:{
//         backgroundColor:'transparent',
//         paddingHorizontal:18,
//         flex:1, 
//         flexDirection:'row',
//     },
// });
// export default CustomList;