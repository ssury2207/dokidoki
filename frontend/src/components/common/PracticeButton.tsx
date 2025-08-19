import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import PaperPlaneIcon from '../atoms/PaperPlane';
import { RootState, AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import Title from '../atoms/Title';
import NormalText from '../atoms/NormalText';
import TextLabel from '../atoms/TextLabel';
import Subtitle from '../atoms/Subtitle';
type Props = {
  questionType: string;
  points: string;
  buttonHandler: () => void;
  context?: boolean | null;
};

const PracticeButton: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <View style={[styles.container, theme ? styles.bgDark : styles.bgLight]}>
      <TouchableOpacity onPress={props.buttonHandler} style={styles.button}>
        <View style={styles.leftSection}>
          <Text style={theme ? styles.titleDark : styles.titleLight}>
            {props.questionType} Question
          </Text>
          {props?.context === null && (
            <Text
              style={
                theme ? styles.subtitleColorDark : styles.subtitleColorLight
              }
            >
              Earn {props.points} Points
            </Text>
          )}
        </View>
        <View style={styles.rightSection}>
          <TextLabel text={'Attempt Now'} />
          <View style={styles.iconWrapper}>
            <PaperPlaneIcon />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    marginVertical: 8,
  },
  bgLight: {
    backgroundColor: '#FFFF',
    borderColor: '#B3B4B7',
  },
  bgDark: {
    backgroundColor: '#393E46',
    borderColor: '#108174',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  leftSection: {
    paddingVertical: 8,
  },
  rightSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  titleLight: {
    color: '#50555C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleDark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitleColorLight: {
    color: '#393E46',
  },
  subtitleColorDark: {
    color: '#CCCCCC',
  },
  iconWrapper: {
    backgroundColor: '#108174',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    padding: 4,
    marginLeft: 4,
  },
});

export default PracticeButton;
