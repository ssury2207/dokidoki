import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QuestionCard from './Components/QuestionCard'
import { FlatList } from 'react-native'
import { RouteProp } from '@react-navigation/native';

type renderItemProps = {
    Question: string,
    Year: number,
    Paper: string,
    Marks: number,
    date: string
}

type PractisedQuestionsScreenRouteProp = RouteProp<{ params: { data: renderItemProps[] } }, 'params'>;

export default function PractisedQuestionsScreen({ route }: { route: PractisedQuestionsScreenRouteProp }) {

    const { data } = route.params;

    const renderItem = ({ item }: { item: renderItemProps }) => (
        <QuestionCard
            question={item.Question}
            year={item.Year}
            paper={item.Paper}
            marks={item.Marks}
            date={item.date}
        />
    )

  return (
    <View>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => idx.toString()}
            ListEmptyComponent={<Text>No Questions Attempted Yet</Text>}
            contentContainerStyle={{paddingBottom: 16}}
        />
      
    </View>
  )
}

const styles = StyleSheet.create({})