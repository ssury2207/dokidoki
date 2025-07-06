import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainsQuestionCard from '../common/MainsQuestionCard'
import OptionsCard from '../common/OptionsCard'
import PrimaryButton from '../atoms/PrimaryButton'



export default function PrelimsScreen() {

    const Data = {
        "que_type":'prelims-que',
        "year": 2020, 
        "paper": "GS-I",
        "question": "Explain the meaning of investment in an economy and the effect of interest rate on it. Also, explain the role of the public investment in crowding-in private investment.",
        "options": ["abc", "def", "ghi", "jkl"],
        "answer": "Investment refers to capital formation in an economy. Lower interest rates encourage private investment. Public investment improves infrastructure and confidence, thereby crowding-in private investment through complementary and multiplier effects.",
        "show_answer": false
    }


  return (
    <View>
        <View style={styles.mainContainerStyle}>
            <MainsQuestionCard fakeData={Data} />
            <OptionsCard options={Data.options}/>
            <PrimaryButton isActive={true} submitHandler={()=>{}} title="Submit" />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainerStyle : {
        paddingHorizontal: 10
    }
})