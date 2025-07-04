import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useState } from "react";
import MainsQuestionCard from '../common/MainsQuestionCard';
import AddPhotosComponents from '../common/AddPhotosComponent';
import PrimaryButton from '../atoms/PrimaryButton';

const Data = {
  "type":'mains-que',
  "year": 2020, 
  "paper": "GS Paper III",
  "marks": 15,
  "question": "Explain the meaning of investment in an economy and the effect of interest rate on it. Also, explain the role of the public investment in crowding-in private investment.",
  "answer": "Investment refers to capital formation in an economy. Lower interest rates encourage private investment. Public investment improves infrastructure and confidence, thereby crowding-in private investment through complementary and multiplier effects.",
  "showAnswer": false
}


const MainsScreen = ({ navigation }) => {
  const [answer,setAnswer] = useState('');
  const [showSubmitButton,setShowSubmitButton] = useState(true);
  const submitHandler=()=>{
      // setShowSubmitButton(false)
      setAnswer(Data.answer)
  }
  return (
    <View style={styles.container}>
       <ScrollView contentContainerStyle={{padding:10}}>
            <View style={{width:'100%',flexDirection:'row'}}>
                <TouchableOpacity>
                {/* <IconSymbol color="black" size={20} name='chevron.right' /> */}
                </TouchableOpacity>
                <Text>Daily Streak Mains Question</Text>
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

            {
                showSubmitButton ?
                 <PrimaryButton isActive={false} submitHandler={submitHandler} title="Submit" />
              :
                <>
                </>
            }
                
       </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default MainsScreen;
