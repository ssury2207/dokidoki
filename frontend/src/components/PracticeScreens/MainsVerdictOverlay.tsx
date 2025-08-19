import { View, StyleSheet } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import Title from '../atoms/Title';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';
import { uploadImageToCloudinary } from '@/src/api/uploadImageToCloudinary';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import FullScreenLoader from '../common/FullScreenLoader';
import { useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
type Props = {
  verdict: boolean;
};

const MainsVerdictOverlay: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();

  const { uid, uploadCopies } = route.params;
  const db = getFirestore();
  const today = new Date().toISOString().substring(0, 10);

  const [loaderVisible, setLoaderVisible] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.isLight);

  async function uploadImagesArrayParallel(
    userId: string,
    images: { id: number; uri: string }[]
  ) {
    const uploadPromises = images.map((img) =>
      uploadImageToCloudinary(img.uri)
    );
    const downloadURLs = await Promise.all(uploadPromises);

    await updateDoc(doc(db, 'users', userId), {
      [`submissions.mains.answerCopies.${today}`]: downloadURLs,
    });
  }

  const overlaySubmitButtonHandler = async () => {
    if (!uid) return;

    try {
      setLoaderVisible(true);
      await uploadImagesArrayParallel(uid, uploadCopies);
      navigation.dispatch(StackActions.pop(2));
    } catch (error) {
      alert('Upload Failed');
      console.error('Upload failed', error);
      navigation.goBack();
    } finally {
      setLoaderVisible(false);
    }
  };

  const overlayBackButtonHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <Title title="Have you added all the Photos?" />

        <View style={styles.row}>
          <NormalText text="All your added photos will be uploaded once you click Submit" />
        </View>

        <PrimaryButton
          isActive={true}
          submitHandler={overlaySubmitButtonHandler}
          title="Submit"
        />
        <PrimaryButton
          isActive={true}
          submitHandler={overlayBackButtonHandler}
          title="Back"
        />
      </View>
      <FullScreenLoader
        visible={loaderVisible}
        message="Uploading, please wait..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalBGLight: {
    backgroundColor: 'white',
  },
  modalBGDark: {
    backgroundColor: '#222831',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default MainsVerdictOverlay;
