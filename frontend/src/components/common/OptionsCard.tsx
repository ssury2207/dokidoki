import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from '@react-navigation/elements';

type OptionsCardProps = {
    options: string[];
};

export default function OptionsCard(props: OptionsCardProps) {
    const optionCode: Record<number, string> = {
        0 : "A",
        1 : "B",
        2 : "C",
        3 : "D"
    }

  return (
    <View style={styles.optionsCardStyle}>
        {props.options.map((option, idx) => (
            <View key={idx} style={styles.optionStyle}>
                <Text>{optionCode[idx]}</Text>
                <Button style={{borderRadius:10, flex:1}}>{option}</Button>
            </View>
        ))} 
    </View>

    
  )
}

const styles = StyleSheet.create({
    optionStyle: { 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        gap: 12,
        alignItems: 'center',
        marginVertical: 5
    },
    optionsCardStyle: { 
        borderWidth:1, 
        borderColor: "black", 
        borderRadius:10, 
        padding:10 
    }
    
})