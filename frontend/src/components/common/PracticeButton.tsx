import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import PaperPlaneIcon from '../atoms/PaperPlane';
import { RootState, AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
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
          <Text style={styles.title}>{props.questionType} Question</Text>
          {props?.context === null && (
            <Text style={styles.subtitle}>Earn {props.points} Points</Text>
          )}
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.title}>Attempt Now</Text>
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
    borderColor: '#B3B4B7',
    borderRadius: 16,
    paddingVertical: 4,
    marginVertical: 8,
  },
  bgLight: {
    backgroundColor: '#FFFF',
  },
  bgDark: {
    borderColor: '#B3B4B7',
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
  title: {
    color: '#50555C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#50555C',
    fontSize: 14,
    fontWeight: 'normal',
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
