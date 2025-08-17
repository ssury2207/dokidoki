import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import MainsQuestionCard from '../common/MainsQuestionCard';
import AddPhotosComponents from '../common/AddPhotosComponent';
import PrimaryButton from '../atoms/PrimaryButton';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalText from '../atoms/NormalText';
import { fetchTodaysQuestion } from '@/src/api/dailyMainsQuestion';
import {
  doc,
  Firestore,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { auth } from '@/src/firebaseConfig';
import FullScreenLoader from '../common/FullScreenLoader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
const MainsScreen = ({ navigation }) => {
  const [data, setData] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const [loaderVisible, setLoaderVisible] = useState(false);
  const [isAnswerCopiesDateExists, setIsAnswerCopiesDateExists] =
    useState<boolean>(false);
  const [todaysAnswerCopies, setTodaysAnswerCopies] = useState<string[]>([]);
  const [uploadCopies, setUploadCopies] = useState<
    { id: number; uri: string }[]
  >([]);

  const db = getFirestore();
  const today = new Date().toISOString().substring(0, 10);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchTodaysQuestion()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkDate = async () => {
      if (!uid) return;
      setLoaderVisible(true);

      const answerCopies = await getAnswerCopies(db, uid);

      if (!answerCopies || !answerCopies[today]) {
        setIsAnswerCopiesDateExists(false);
        setTodaysAnswerCopies([]);
      } else {
        setIsAnswerCopiesDateExists(true);
        setTodaysAnswerCopies(answerCopies[today]);
      }
      setLoaderVisible(false);
    };

    checkDate();
  }, [uid, db, today]);

  const submitHandler = async () => {
    navigation.navigate('MainsVerdictOverlay', { uid, uploadCopies });
  };

  async function getAnswerCopies(db: Firestore, userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) return null;

    const userData = userSnap.data();
    const answerCopies = userData?.submissions?.mains?.answerCopies;

    return answerCopies || null;
  }

  if (!data) return <Text>No question found for today.</Text>;

  return (
    <SafeAreaView
      style={[
        theme
          ? [styles.bodyBGDark, styles.body]
          : [styles.bodyBGLight, styles.body],
      ]}
    >
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="MAINS QUESTION"
          subtite="Upload your handwritten answer to keep the streak alive!"
        />
        <UserStats />
        <Card>
          <MainsQuestionCard fakeData={data} />

          <AddPhotosComponents
            isAnswerUploaded={isAnswerCopiesDateExists}
            uploadCopies={uploadCopies}
            setUploadCopies={setUploadCopies}
            navigation={navigation}
          />
          {isAnswerCopiesDateExists &&
            todaysAnswerCopies.map((url, idx) => (
              <View key={idx} style={styles.fileItem}>
                <Text style={styles.fileText}>{idx}.jpg</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('FullScreenImageViewer', {
                      imageUrl: url,
                    })
                  }
                >
                  <Image
                    source={{ uri: url }}
                    style={{ height: 50, width: 50 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          {isAnswerCopiesDateExists ? (
            <NormalText text={'Thank you for writing an answer today'} />
          ) : (
            <></>
          )}
          <PrimaryButton
            isActive={!isAnswerCopiesDateExists}
            submitHandler={submitHandler}
            title="Submit"
          />
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible || loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyBGDark: {
    backgroundColor: '#222831',
  },
  bodyBGLight: {
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  fileItem: {
    borderColor: '#FFC618',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
  },
  fileText: {
    color: '#37B9C5',
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

export default MainsScreen;
