import React,{useState, useEffect} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    I18nManager,
    StyleSheet,
    Dimensions
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import myColor from '../styles/colors'
import Modal from 'react-native-modal'
import StarRating from 'react-native-star-rating';
import { StatusBar } from 'expo-status-bar';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
                 <View style={[styles.modalStyle,{height:SCREEN_HEIGHT-70}]} > 
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
                <View  style={styles.modalStyle} >
                    <View style={{backgroundColor:myColor.darkBlue,flexDirection:'row',}}>
                        <Text style={[styles.title,{flex:6}]}>
                            {props.selected.title} 
                        </Text>
                        <TouchableOpacity onPressOut={props.hideModal} style={{flex:1, alignContent:'center',justifyContent:'center',paddingVertical:5}}>
                        <Text style={{fontWeight:'bold', color:'#fff', textAlign:'center',textAlignVertical:'center'}}>X</Text>
                        </TouchableOpacity>
                        
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
                            <Text style={styles.title}>
                                {'לחצי כאן עבור סיפורי לידה'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </Modal>
        </View>
    );
};
function Rating(props){
    const [hospitals, setHospitals] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(()=>{
        fetchData();
    },[])
    const fetchData = () =>{
        const { route } = props;
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
            setHospitals(data);
        }  
    }
    _hideMyModal = () => { 
        setIsModalVisible(false);
    }
    toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const Item = ({item}) =>{
        return (<TouchableOpacity 
            onPress={()=>{toggleModal();setSelectedItem(item)}}
            style={[styles.list, ]}
            >
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
            <View 
                style={{
                    flex:1,
                    flexDirection:'row',
                    paddingHorizontal:5,
                    justifyContent:'center',
                    alignItems:'center'
            }}
            >
            <Text style = {{textAlign:'center',fontSize:18, flex:3, color:myColor.red, fontWeight:"bold"}}>{item.title}</Text>
            <Text style = {{textAlign:'left',fontSize:14,flex:1, fontWeight:"bold"}}>{'('+item.rate.toFixed(2)+')'}</Text>
            </View>
        </TouchableOpacity>);
    }
    const listItem = ({item}) =><Item item={item} />;
    return(
        <SafeAreaView style={{flex:1}}>
            <LinearGradient colors={[ myColor.gold,'#fff', myColor.lightBlue, myColor.darkBlue]}
                        locations={[0,0.1,0.8,1]}
                        style={{flex:1}}>
            { isModalVisible && <MyModal selected={selectedItem} modalVisible={isModalVisible} hideModal={_hideMyModal} /> }
            {/* Header */}
            <FlatList
                style = {{paddingHorizontal:3, backgroundColor:'transparent'}}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                data={hospitals}
                renderItem={listItem}
                keyExtractor={item => item.id.toString()}
            />
            </LinearGradient>
            <StatusBar style="light" hidden={(Platform.OS==='ios')?false:true}/>
        </SafeAreaView>
    )
}
export default Rating;

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row-reverse',
        // flex:1,
        borderTopWidth: 1,
        borderTopColor: myColor.darkBlue,
        // height:64,
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
    title:{
        fontSize:24, 
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        paddingVertical:5
    },

});