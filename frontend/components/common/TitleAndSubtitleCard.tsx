import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import Card from '../atoms/Card';

type Props = {
  title:string,
  subtite?:string
};

const TitleAndSubtitleCard: React.FC<Props> = (props) => {
  return (
    <Card>
        <Title title={props.title} />
        {
            props.subtite?
            <Subtitle subtitle={props.subtite} />
            :<></>
        }
    </Card>
        
     
  );
};
 
export default TitleAndSubtitleCard;
