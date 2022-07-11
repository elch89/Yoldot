import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { VStack} from 'native-base'
import Details from './CompareHospitalsDetails'
import SearchBox  from '../components/SearchHeader'
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'
import { StatusBar } from 'expo-status-bar';

function Compare(props){
  const [val, setVal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionComplete, setSelectionComplete] = useState(false); 
  const [selectedHospitals, setSelectedHospitals] = useState([]); 
  const [hospitals, setHospitals] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [data, setData] = useState([]); 
  
  useEffect(()=>{
    fetchData();
  },[]);

  async function fetchData(){
    const { route } = props;
    let arr = route.params?.value ?? 'A problem fetching data';
    let tempArr = Array();
    arr[0].map((item,index)=>{
      tempArr.push({id:(item.id-1), name:item.name})
    })
    setHospitals(tempArr)
    setCategories(arr[1]);
    try{
      const response = await fetch(connection.URL+'content.php');
      const responseJson = await response.json();
      setData(responseJson)
    }
    catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
    
  }

  const getCategories =(cat) => {
    let arr = Array();
    for(let i=2;i<cat.length;i++){
      arr.push({id:i-1,title:cat[i].category});
    }
    return  arr;
  }

  const getContentByIndex = (selected, content)=>{
    let arr = Array(); 
    let temp = Array();
    if(selected.length == 0){
      return [];
    }
    for(let i=0;i<content.length;i++){
      temp = Object.values(content[i]); 
      temp.shift();
      temp.shift();
      let selecteIdArray = [];
      selected.forEach(selecteId => {
        selecteIdArray.push(temp[selecteId.id+1])
      });
      let ds = {
        cid:i,
        subCat:temp[0],
        describe:selecteIdArray
      };
      arr.push(ds)   
    }
    return arr;
  }

  const updateChosen = (dataFromChild) => {
    if(dataFromChild.length >0){
      setSelectionComplete(true);
      setSelectedHospitals(dataFromChild);
    }
    else{
      setSelectionComplete(false);
      setSelectedHospitals([]);
    }
  }

  const renderElements = () => {
    let resu = [];
    if(data !== undefined){
      resu = getContentByIndex(selectedHospitals,data);
    }
    let filter;
    switch (val) {
      case 0:
        filter = resu.slice(0,4);
        break;
      case 1:
        filter = resu.slice(4,10);
        break;
      case 2:
        filter = resu.slice(10,18);
        break;
      case 3:
        filter = resu.slice(18,22);
        break;
      case 4:
        filter = resu.slice(22,33);
        break;
      case 5:
        filter = resu.slice(33,37);
        break;
      case 6:
        filter = resu.slice(37,42);
        break;
      case 7:
        filter = resu.slice(42,46);
        break;
      case 8:
        filter = resu.slice(46,69);
        break;     
      case 9:
        filter = resu.slice(69,89);
        break;
      case 10:
        filter = resu.slice(89,99);
        break;
      case 11:
        filter = resu.slice(99); 
        break;
                
      default:
        console.log("Coldnt fetch data")
        break;
    }
    return <Details dataPass={filter}/>;
  }

  const renderHospitalInfo=()=>{
    if(selectionComplete){
      return(
        <View style={{borderRadius:20, }}>{renderElements()}</View>
      );  
    }
    return(<View style={{ flex: 1, justifyContent:'center'}}><Text style={{alignSelf:'center',fontSize:18,color:myColor.red}}>לא נבחרו בתי יולדות מהרשימה למעלה</Text></View>);    
  }
   
  // Loading check if network error
  if (isLoading) {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ActivityIndicator />
      </View>
   );
  }
  return (
      <SafeAreaView style={{flex:1}}>
      <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                        locations={[0,0.1,0.7,1]}
                        style={{flex:1}}>
        <VStack  style={styles.container}>
          <VStack h="1/4" style={[{flex:3, backgroundColor:'transparent',margin:5,
        padding:10,}]}>
          <SearchBox hospitals={hospitals} callbackFromParent={updateChosen}/>
            <Category          
                data={getCategories(categories)}    
                itemSelected={(item) => setVal(item.id-1)}
                colorItemSelected = {myColor.darkBlue}
                colorTextSelected = '#ffffff'
                style = {{backgroundColor:'transparent'}}
                itemStyles = {{borderColor:myColor.darkBlue, borderWidth:1,height:48, minWidth:80,fontSize:18}}
              />
          </VStack>
            <VStack 
              style={[styles.detail,{flex:8}]}>
            {renderHospitalInfo()}
            </VStack>
          </VStack> 
          </LinearGradient> 
          <StatusBar style="light" hidden={(Platform.OS==='ios')?false:true}/>  
      </SafeAreaView>);
}
export default Compare;

const Category =(props)=>{
  
  let arrCategory = [];
  props.data.map((item, index) => {
    let newObject;
    index === 0 ?
    newObject = Object.assign({isSelected: true }, item):
    newObject = Object.assign({isSelected: false}, item);
    arrCategory.push(newObject);});
  const [data,setData] = useState(arrCategory);
  const [indexSelected,setIndexSelected] = useState(0);
  const [nativeEvent,setNativeEvent]=useState()
  useEffect(()=>{
    
    let onPress = props.itemSelected;
    typeof onPress === 'function' && onPress(data[0]);
  },[]);
  function renderItemCategory({item, index}) {
    const colorTextSelected = item.isSelected ? props.colorTextSelected : myColor.darkBlue;
    const colorItemSelected = item.isSelected ? props.colorItemSelected : 'rgba(255,255,255,0.2)';
    return (
      <TouchableOpacity
        style={[styles.itemStyles, props.itemStyles, { backgroundColor: colorItemSelected }]}
        onPress={()=>handleItemCategoryClick(item, index)}
      >
        
          <Text style={[styles.textItemStyles, {color: colorTextSelected}]}>
            {item['title']}
          </Text>
      </TouchableOpacity>
    );
  };
  //action when click item
  function handleItemCategoryClick(item, rowID) {
    item.isSelected = !item.isSelected;
    const dataClone = data;

    const unSelected = dataClone[indexSelected];
    unSelected.isSelected = !unSelected.isSelected;

    dataClone[indexSelected] = unSelected;
    dataClone[rowID] = item;

    setData(dataClone);
    setIndexSelected(rowID);

    //call back item selected
    let onPress = props.itemSelected;
    typeof onPress === 'function' && onPress(item);
  }
  const start = nativeEvent?nativeEvent.contentOffset.x*
  (nativeEvent.layoutMeasurement.width/nativeEvent.contentSize.width)
  :0;
  return (
    <View style={{flex:1, flexDirection:"row",}} >
    <View style={{flex:1, flexDirection: 'column', }}><FlatList
      style={[styles.categoryStyles, props.style,]}
      contentContainerStyle={styles.flatListStyles}
      horizontal
      // persistentScrollbar={true}
      scrollEventThrottle={5}
      showsHorizontalScrollIndicator={false}
      onScroll={event => setNativeEvent(event.nativeEvent)}
      keyExtractor={(item, index) => index}
      onEndReachedThreshold={1}
      renderItem={renderItemCategory}
      data={data}
    />
    <View
      style={{
        width:'100%',
        height:4,
        backgroundColor:myColor.lightBlue,
        borderRadius:20,
        overflow:'hidden'
      }}>
    <View
    style={{
      start,
      bottom:0,
      width: '30%',
      height: 4,
      backgroundColor: myColor.darkBlue,
      borderRadius: 20
    }}
  />
    </View>
    
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ecf0f1',
        padding: 0,
        flexDirection:'column',
        
      },
      detail:{
        // flex: 8 ,
        backgroundColor:'#fff',
        borderColor:'#000',
        borderRadius:20,
        borderWidth:1,
        margin:5,
        padding:10,
      },
      itemStyles: {
        padding: 8,
        marginRight: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      textItemStyles: {
        textAlign: 'center'
      },
      categoryStyles: {
        backgroundColor: '#000',
      },
    
      flatListStyles: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        paddingRight: 0,
      },
});