import { StyleSheet,ScrollView, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainsQuestionCard from '../common/MainsQuestionCard'
import OptionsCard from '../common/OptionsCard'
import PrimaryButton from '../atoms/PrimaryButton'
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard'
import UserStats from '../common/UserStats'
import Card from '../atoms/Card'
import { SafeAreaView } from 'react-native-safe-area-context';
import Data from '../../fakeData/data';
import NormalText from '../atoms/NormalText'
import TextLabel from '../atoms/TextLabel'
export default function PrelimsScreen() {
      const [buttonActive,setButtonActive] = useState(true);
      const [showAnswer,setShowAnswer] = useState(false);
      const [data, setData] = useState({});

      useEffect(()=>{
        Data[0].map((data)=> setData(data));
      }
      , [data]);
      const submitHandler=()=>{
            setButtonActive(false)
            setShowAnswer(true)
        

    }
    const display=()=>{
        data.options.map((option:any)=>
        console.log(option)
        )
    }
  
  return (
    <SafeAreaView  style ={styles.body}>
      <ScrollView style={styles.scroll}>
      
      <TitleAndSubtitleCard title='PRELIMS QUESTION' subtite= "Select one correct option to keep streak alive and earn points!" />
      <UserStats streak='5' points='100'/>
      <Card>
                    <View style={styles.cardContainer}>
                    <View style={styles.row}>
                        <NormalText text='Year :' />
                        <NormalText text= {data.year} />
                    </View>

                    <View style={styles.row}>
                        <NormalText text='Paper :' />
                        <NormalText text= {data.paper} />
                    </View>

                    <View style={styles.questionContainer}>
                        <NormalText text= {data.question} />
                    </View>
                 
                    </View>
                    
             <PrimaryButton isActive={true} submitHandler={submitHandler} title="Submit" />
             <PrimaryButton isActive={true} submitHandler={display} title="DISPLAY" />

                {
                            showAnswer?
                            <View>
                                  <TextLabel text={`Correct Option: ${data.correctOption}`} />
                                  <NormalText text={data.answer} />
                            </View>
                              
                            :
                            <></>
                }   
    </Card>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor:'#F0F3F6',                 
      },
      scroll:{
        paddingBottom:40,
        paddingHorizontal:24
      },
      cardContainer: {
        flexDirection: 'column',
        marginVertical:20,
      },
      row: {
        flexDirection: 'row',
        justifyContent:'flex-start'
      },
      label: {
        fontWeight: '500',
        margin: 2,
      },
      questionContainer: {
        marginVertical: 8,
      },
      questionText: {
        fontWeight: '400',
        fontStyle: 'italic',
        fontSize: 16,
      },
})