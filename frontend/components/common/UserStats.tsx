import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';
import Card from '../atoms/Card';
import TextLabel from '../atoms/TextLabel';
import NormalText from '../atoms/NormalText';

type Props = {
  streak:string,
  points :string,
};

const UserStats: React.FC<Props> = (props) => {
  return (
       <Card>
        <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around', }}>
            <View style={styles.streak}>
                <TextLabel text='STREAK: ' />
                <NormalText text={`${props.streak} Days`} />
            </View>
            <View style={styles.streak}>
                <TextLabel text='TOTAL POINTS: '/>
                <NormalText text={props.points} />
            </View>
        </View>
       </Card>
  );
};

const styles = StyleSheet.create({
  title:{
    color:'#37B9C5',
    textAlign:'center',
    fontSize:24,
    fontWeight:'bold',
    marginVertical:8
  },
  streak:{
    flexDirection:'row'
  }
});

export default UserStats;
