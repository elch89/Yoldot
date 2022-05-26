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
import {NativeBaseProvider, VStack} from 'native-base'
import Details from './CompareHospitalsDetails'
import SearchBox  from '../components/SearchHeader'
import myColor from '../styles/colors'
import {connection} from '../data/DataSource'
import Icon from 'react-native-vector-icons/AntDesign'

const leftArrow = (<Icon name='doubleleft' size={30} color={myColor.gold} />);
export default class Compare extends React.Component{
  constructor () {
    super()
    this.state = {
      selectedIndex: 0,
      val:0,
      isLoading: true,
      twoHospSelected:false,
      chosenHospitals:[],
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateChosen = this.updateChosen.bind(this)
  }

  async componentDidMount(){
    const { route } = this.props;
    let arr = route.params?.value ?? 'A problem fetching data';
    
    let tempArr = Array();
    arr[0].map((item,index)=>{
      tempArr.push({id:(item.id-1), name:item.name})
    })
    this.setState({
      isLoading: false,
      hospList:tempArr,
      cats:arr[1],
      bothSelected:false,
    });
    try{
      const response = await fetch(connection.URL+'content.php');
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        collectedData: responseJson,
            });
      }
      catch (error) {
        console.error(error);
      }
  }
  updateIndex (selectedIndex) {
    this.setState({selectedIndex, val:0})
  }
  updateCategory(selectedCategory){
    this.setState({val:selectedCategory})
  }
   // Fix update of render if one is deleted!
  updateChosen (dataFromChild) {
    if(dataFromChild.length === 2 && this.state.chosenHospitals.length < 2){
      this.setState({bothSelected:true, chosenHospitals:dataFromChild})
    }
    else if(dataFromChild.length < 2 && this.state.chosenHospitals.length === 2){
      this.setState({bothSelected:false, chosenHospitals:dataFromChild})
    }
  }

  renderElements(){
    let resu = [];
    const collectedData = this.state.collectedData;
    if(collectedData !== undefined){
      resu = this.getContentByIndex(this.state.chosenHospitals,collectedData);
    }
    let filter;
    if(this.state.val===7){
      filter = resu.slice(42,46);
    }
    else if(this.state.val===1){
      filter = resu.slice(4,10);
    }
    else if(this.state.val===5){
      filter = resu.slice(33,37);
    }
    else if(this.state.val===0){
      filter = resu.slice(0,4);
    }
    else if(this.state.val===2){
      filter = resu.slice(10,18);
    }
    else if(this.state.val===3){
      filter = resu.slice(18,22);
    }
    else if(this.state.val===4){
      filter = resu.slice(22,33);
    }
    else if(this.state.val===6){
      filter = resu.slice(37,42);
    }
    else if(this.state.val === 8){
      filter = resu.slice(46,69);
    }
    else if(this.state.val === 9){
      filter = resu.slice(69,89);
    }
    else if(this.state.val === 10){
      filter = resu.slice(89,99);
    }
    else{
      filter = resu.slice(99);
    }
    return <Details dataPass={filter} chosen={this.state.chosenHospitals}/>;
  }
  getCategories(cat){
    let arr = Array();
    for(let i=2;i<cat.length;i++){
      arr.push({id:i-1,title:cat[i].category});
    }
    return  arr;
  }
  getContentByIndex(selected, content){
    let arr = Array(); 
    let temp = Array();
    if(selected.length == 0){
    return [];
    }
    for(let i=0;i<content.length;i++){
      temp = Object.values(content[i]); 
      temp.shift();
      temp.shift();
      let ds = {cid:i,subCat:temp[0],describe:[temp[selected[0].id+1], temp[selected[1].id+1]]};
      arr.push(ds)   
    }
    return arr;
  }
  render () {
    const hospitals =this.state.hospList;
    const categories = this.state.cats
    
    // Loading check if network error
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (<NativeBaseProvider >
      <SafeAreaView style={{flex:1}}>
        <VStack  style={styles.container}>
          <VStack h="1/4" style={[styles.detail,{flex:3}]}>
          <SearchBox hospitals={hospitals} callbackFromParent={this.updateChosen}/>
            <Category          
                data={this.getCategories(categories)}    
                itemSelected={(item) => this.updateCategory(item.id-1)}
                colorItemSelected = {myColor.darkBlue}
                colorTextSelected = '#ffffff'
                style = {{backgroundColor:'transparent'}}
                itemStyles = {{borderColor:myColor.darkBlue, borderWidth:1,height:48, minWidth:80,fontSize:18}}
              />
          </VStack>
            <VStack 
              style={[styles.detail,{flex:8}]}>
            {this.renderHospitalInfo()}
            </VStack>
          </VStack>    
      </SafeAreaView>
      </NativeBaseProvider>);
  }

  renderHospitalInfo(){
    if(this.state.bothSelected){
      return(
        <View style={{borderRadius:20, }}>{this.renderElements()}</View>
      );  
    }
    return(<View style={{ flex: 1, justifyContent:'center'}}><Text style={{alignSelf:'center',fontSize:18,color:myColor.red}}>לא נבחרו שני בתי יולדות מהרשימה למעלה</Text></View>);    
    }
}

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
  return (
    <View style={{flex:1, flexDirection:"row",}} >
    <View style={{flex:0.9}}><FlatList
      style={[styles.categoryStyles, props.style,]}
      contentContainerStyle={styles.flatListStyles}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index}

      renderItem={renderItemCategory}
      data={data}
    /></View>
    <View style={{flex:0.1,justifyContent:'center',}}>{leftArrow}</View>
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