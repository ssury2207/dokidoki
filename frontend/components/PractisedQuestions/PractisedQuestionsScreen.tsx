import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QuestionCard from './Components/QuestionCard'
import { FlatList } from 'react-native'

type renderItemProps = {
    question: string,
    year: number,
    paper: string,
    marks: number
}
export default function PractisedQuestionsScreen() {

    const Data = [
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        }, 
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        },
        {
            question: "Implementation of Information and Communication Technology (ICT) based Projects/Programmes usually suffers in terms of certain vital factors. Identify these factors, and suggest measures for their effective implementation. Also, discuss how the use of ICT can help in achieving the objectives of good governance in India, citing relevant examples from recent government initiatives. In your answer, critically examine the challenges faced by various stakeholders, including government agencies, citizens, and private partners, in the adoption and scaling up of ICT solutions across different sectors such as health, education, and public service delivery. Conclude by proposing a roadmap for sustainable and inclusive digital transformation in India.",
            year: 2021,
            paper: "GS-II",
            marks: 15
        }
    ]

    const renderItem = ({ item }: { item: renderItemProps }) => (
        <QuestionCard
            question={item.question}
            year={item.year}
            paper={item.paper}
            marks={item.marks}
        />
    )

  return (
    <View>
        <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => idx.toString()}
            ListEmptyComponent={<Text>No Questions Attempted Yet</Text>}
            contentContainerStyle={{paddingBottom: 16}}
        />
      
    </View>
  )
}

const styles = StyleSheet.create({})