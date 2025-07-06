import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useState } from "react";
import MainsQuestionCard from '../common/MainsQuestionCard';
import AddPhotosComponents from '../common/AddPhotosComponent';
import PrimaryButton from '../atoms/PrimaryButton';

const Data = {
  "que_type":'mains-que',
  "year": 2020, 
  "paper": "GS Paper III",
  "marks": 15,
  "question": "Explain the meaning of investment in an economy and the effect of interest rate on it. Also, explain the role of the public investment in crowding-in private investment.",
  "answer": "Investment refers to capital formation in an economy. Lower interest rates encourage private investment. Public investment improves infrastructure and confidence, thereby crowding-in private investment through complementary and multiplier effects.",
  "show_answer": false
}


const MainsScreen = () => {
  const [answer,setAnswer] = useState('');
  const [buttonActive,setButtonActive] = useState(true);
  const submitHandler=()=>{
      setButtonActive(false)
      setAnswer(Data.answer)
  }
  return (
    <View style={styles.container}>
       <ScrollView contentContainerStyle={{padding:10}}>
            <View style={{width:'100%',flexDirection:'row'}}>
                <TouchableOpacity>
                {/* <IconSymbol color="black" size={20} name='chevron.right' /> */}
                </TouchableOpacity>
                <View style={{width:'100%',marginVertical:18,padding:10}}>
                  <Text style={{fontSize:18,fontWeight:'600',textAlign:'center'}}>Daily Streak - Mains Question</Text>
                  <Text style={{fontSize:14,fontWeight:'400',textAlign:'center',color:'#090F4773'}}>Upload your handwritten answer to keep the streak alive!</Text>
                </View>
            </View>

            <MainsQuestionCard fakeData={Data} />
            <AddPhotosComponents />

            {
                answer===''?<></>:

            <View style={{borderWidth:1,padding:4,    marginVertical:15, borderStyle:"dashed",flexDirection:'column'}} >
               <Text>
               {Data.answer}
               </Text>
            </View>
            }

            
            <PrimaryButton isActive={buttonActive} submitHandler={submitHandler} title="Submit" />
              
                
       </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:'#FFF',paddingBottom:18, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default MainsScreen;
