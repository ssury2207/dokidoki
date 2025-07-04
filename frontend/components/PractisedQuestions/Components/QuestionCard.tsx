import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type QuestionCardProps = {
    question: string,
    year: number,
    paper: string,
    marks: number
}

export default function QuestionCard(data: QuestionCardProps) {
  return (
    <View style={{borderColor: "Black", borderWidth: 1, borderRadius:10, marginHorizontal:15, marginTop:10, padding:10}}>
      <Text numberOfLines={2} ellipsizeMode='tail' style={{marginBottom: 10}}>{data.question}</Text>
      
      <Text>Year:{data.year} Paper:{data.paper} Marks:{data.marks}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})