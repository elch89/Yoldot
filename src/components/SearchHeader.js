import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Image,
} from 'react-native';
import myColor from '../styles/colors'
// @ts-ignore
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class SearchHeader extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedItems:[],
      pHolder: "בחרי בית חולים"
    }
  }
  // For solving rendering issues
  componentDidUpdate(){
    this.sendToParent()
    return true;
  }  
    render(){
      if(this.state.selectedItems.length<2){
          return(
            <View style={{}}>
              <SearchableDropdown
            multi={true}
            selectedItems={this.state.selectedItems}
            onItemSelect={(item) => {
              const items = this.state.selectedItems;
                items.push(item)
                this.setState({ selectedItems: items });
                Keyboard.dismiss();
              
            }}
            containerStyle={{ padding: 5 }}
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedItems: items });
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222', fontSize:18}}
            itemsContainerStyle={{ maxHeight: 120 }}
            items={this.props.hospital}
            chip={false}
            resetValue={false}
            textInputProps={
              {
                placeholder: this.state.pHolder,
                underlineColorAndroid: "transparent",
                style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    fontSize:20,
                },
                onBlur:()=>{
                }
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
          />
          {/* view for selected categories */}
          <View style = {{flexDirection:'row',alignContent:'space-between', flexWrap: 'wrap'}}>{this.renderSelected()}</View>
      </View>
        )
      }
      else{
        return <View style = {{flexDirection:'row',alignContent:'space-between', flexWrap: 'wrap'}}>{this.renderSelected()}</View>
      }
        
    }
    sendToParent(){
      this.props.callbackFromParent(this.state.selectedItems)
    }
    renderSelected(){
      let selectedArray = Array()
      const color =[myColor.lightBlue, myColor.red]
      this.state.selectedItems.map((n,i)=>{
        selectedArray.push(<TouchableOpacity 
                              key={i} 
                              style={[styles.selected, {backgroundColor:color[i]}]} 
                              onPress={()=>{
                                const items = this.state.selectedItems.filter((sitem) => sitem.id !== n.id);
                                this.setState({ selectedItems: items });
                              }}>
                              <Text style={{textAlign:'center', paddingHorizontal:10, fontSize:18}}>{n.name}</Text>
                              <Image style={
                                {
                                  width: 20,
                                  height: 20,
                                  position: 'absolute',
                                  left: 0,
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                  padding:10,
                                }
                              } 
                              source={require('../../assets/img/error.png')}></Image>
                              </TouchableOpacity>)
      })
      return selectedArray
    }
}

const styles = StyleSheet.create({

  selected:{
    justifyContent:'center',
    flexDirection:'row',
    minHeight:48,
    flex:1,
    borderColor:'black',
    borderWidth:1,
    borderRadius:10,
    padding:5,
    // margin:5
  },
});