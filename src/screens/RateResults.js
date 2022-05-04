import React,{useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    I18nManager,
    StyleSheet,
} from 'react-native';
import myColor from '../styles/colors'
import Modal from 'react-native-modal'
import StarRating from 'react-native-star-rating'
const StoryModal = (props)=>{
    let story = []
    for(var i=0;i<props.selected.stories.length;i++){
        story.push({val:JSON.parse('"'+props.selected.stories[i]+'"'),id:i});
        story[i].val = story[i].val.replace(/(\r\n|\n|\r|\\|n)/gm, " ");
    }
    return (
        <View>
            <Modal isVisible={props.modalVisible}
                backdropOpacity={0.3}
                onBackdropPress={props.toggle}
                onBackButtonPress={props.toggle}>
                 <View style={styles.modalStyle} > 
                    <FlatList 
                        horizontal={false}
                        data={story}
                        renderItem={({ item }) =>(
                            <View style={[styles.modalItem,{borderTopColor: 'transparent'}]}
                           >
                                <View 
                                    style={ {
                                        flex:1,
                                        alignItems:'center',
                                        justifyContent:'center',
                                        paddingHorizontal:10
                                    }}>
                                    <Text style = {{textAlign:'center',fontSize:18,}}>{'\r\n'+item.val+'\n\n \u2B24 '}</Text>
                      
                                </View>
                            </View>
                         )}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </Modal>
        </View>
    );
}
const MyModal = (props)=>{
    const [visible, setVisible] = useState(false);
    const toggleStories =()=>{
        setVisible(!visible)
    }
    return (
        <View>
            <Modal isVisible={props.modalVisible}
              backdropOpacity={0.3}
             onBackdropPress={props.hideModal}
             onBackButtonPress={props.hideModal}>
                 {visible && <StoryModal selected={props.selected} modalVisible={visible} toggle={()=>toggleStories()}/>}
                <TouchableOpacity activeOpacity={0} style={styles.modalStyle} onPress={props.hideModal}>
                {/* <TouchableOpacity activeOpacity={0} style={styles.modalStyle} onPress={}> */}
                    <View style={{backgroundColor:myColor.darkBlue}}>
                        <Text style={{
                                fontSize:24, 
                                color:'#fff',
                                textAlign:'center',
                                fontWeight:'bold',
                                paddingBottom:10,
                                paddingTop:6,
                            }}>
                            {props.selected.title} 
                        </Text>
                    </View>
                    <FlatList 
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        data={props.selected.items}
                        renderItem={({ item }) =>(
                            <View style={styles.modalItem}
                           >
                                <View style={{flexDirection:'row',flex:1,alignItems:'center',paddingHorizontal:10,paddingVertical:5}}>
                                    <View style = {{flex:3}}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            starStyle={{flex:1,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
                                            fullStarColor={myColor.gold}
                                            halfStarColor={myColor.gold}
                                            emptyStarColor={myColor.gold}
                                            rating={item.rate}
                                        />
                                    </View>
                                    <Text style = {{textAlign:'center',fontSize:14,flex:1}}>{'('+item.rate.toFixed(2)+')'}</Text>
                                </View>
                                <View 
                                    style={ {
                                        flex:1,
                                        alignItems:'center',
                                        justifyContent:'center',
                                        paddingHorizontal:10
                                    }}>
                                    <Text style = {{textAlign:'center',fontSize:24,}}>{item.title}</Text>
                      
                                </View>
                            </View>
                         )}
                        keyExtractor={item => item.tid.toString()}
                    />
                    
                    <TouchableOpacity onPress={()=>toggleStories()}>
                        <View style={{backgroundColor:myColor.darkBlue}}>
                            <Text style={{
                                    fontSize:24, 
                                    color:'#fff',
                                    textAlign:'center',
                                    fontWeight:'bold',
                                    paddingBottom:10,
                                    paddingTop:6,
                                }}>
                                {'לחצי כאן עבור סיפורי לידה'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>

            </Modal>
        </View>
    );
};

export default class Rating extends React.Component{
    constructor(props){
        super(props)
        this.state={
            starCount:3.5,
            hospitals:[],
            isModalVisible: false,
            selectedItem:null,
        }
    }
    componentDidMount(){
        const { route } = this.props;
        let hospArr = route.params?.rating ?? 'A problem fetching data';
        let data = [];
        if(hospArr !=='A problem fetching data'){
            hospArr.map((item,i)=>{
                const categories = [{title:'כבוד',tid:0,rate:parseFloat(hospArr[i].praty[0])}, {title:'פרטיות',tid:1,rate:parseFloat(hospArr[i].praty[1])}, 
                {title:'חיסיון רפואי',tid:2,rate:parseFloat(hospArr[i].praty[2])}, {title:'בחירה מדעת',tid:3,rate:parseFloat(hospArr[i].praty[3])}, 
                {title:'תמיכה רציפה',tid:4,rate:parseFloat(hospArr[i].praty[4])}, {title:'תקשורת אפקטיבית',tid:5,rate:parseFloat(hospArr[i].praty[5])}, 
                {title:'שביעות רצון',tid:6,rate:parseFloat(hospArr[i].praty[6])}];
                data.push({title:JSON.parse('"'+item.hospital+'"'),id:item.id,rate:parseFloat(hospArr[i].clali), items:categories, stories:hospArr[i].stories})
            });
            this.setState({hospitals:data, });
        }  
    }

    _hideMyModal = () => { 
        this.setState({isModalVisible: false});
    }

    render(){
        const hospitals = this.state.hospitals;
        return(
            <SafeAreaView>
                { this.state.isModalVisible && <MyModal selected={this.state.selectedItem} modalVisible={this.state.isModalVisible} hideModal={this._hideMyModal} /> }
                {/* Header */}
                <View style={{backgroundColor:myColor.darkBlue}}>
                    <Text style={{
                        fontSize:24, 
                        color:'#fff',
                        textAlign:'center',
                        fontWeight:'bold',
                        paddingBottom:10,
                        paddingTop:6,
                    }}>
                        בתי יולדות - ציון משוקלל
                    </Text>
                </View>
                <FlatList
                    style = {{paddingHorizontal:3}}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    data={hospitals}// hospitals
                    renderItem={({ item }) =>(
                        <TouchableOpacity 
                            onPress={()=>{this.toggleModal();this.setState({selectedItem:item})}}
                            style={styles.list}>
                            <StarRating
                                disabled={true}
                                containerStyle = {{ flex:1, padding:10, alignSelf:'center'}}
                                maxStars={5}
                                starSize={30}
                                starStyle={{flex:1,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
                                fullStarColor={myColor.gold}
                                halfStarColor={myColor.gold}
                                emptyStarColor={myColor.gold}
                                rating={item.rate}
                            />
                            {/* </View> */}
                            <View 
                                style={{
                                    flex:1,
                                    flexDirection:'row',
                                    paddingHorizontal:5,
                                    justifyContent:'center',
                                    alignItems:'center'
                            }}
                            >
                            <Text style = {{textAlign:'center',fontSize:18, flex:3, color:myColor.red}}>{item.title}</Text>
                            <Text style = {{textAlign:'left',fontSize:14,flex:1}}>{'('+item.rate.toFixed(2)+')'}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </SafeAreaView>
        )
    }
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
      };
    
}


const styles = StyleSheet.create({
    list: {
        flexDirection: 'row-reverse',
        flex:1,
        borderTopWidth: 1,
        borderTopColor: myColor.darkBlue,
    },
    modalItem:{
        flexDirection:'column-reverse',
        flex:1,
        borderTopWidth: 1,
        borderTopColor: myColor.darkBlue
    },
    modalStyle:{
        backgroundColor:'#fff',
        borderRadius:20,
        alignContent:'stretch',
        borderWidth:3,
        borderColor:myColor.darkBlue,
    },

});