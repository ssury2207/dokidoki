import { View, TextInput, ScrollView } from 'react-native';
import Title from '../atoms/Title';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import SecondaryButton from '../atoms/SecondaryButton';
import FixedImageCarousel from '../common/FixedImageCarousel';
import Checkbox from '../atoms/Checkbox';
import DisclaimerText from '../atoms/DisclaimerText';
import { RootStackParamList } from '@/src/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { supabase } from '@/src/supabaseConfig';
import { Alert } from 'react-native';
import FullScreenLoader from '../common/FullScreenLoader';

type CreatePostOverlayProps = NativeStackScreenProps<
  RootStackParamList,
  'CreatePostOverlay'
>;

const CreatePostOverlay = ({ navigation, route }: CreatePostOverlayProps) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const userName = useSelector(
    (state: RootState) => state.userProgress.userName
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const images = route.params?.images || [];
  const question = route.params?.question || '';
  const year = route.params?.year || '';
  const paper = route.params?.paper || '';
  const questionId = route.params?.questionId || '';

  const overlayButtonHandler = () => {
    navigation.goBack();
  };

  const postButtonHandler = async () => {
    // Validate user authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    // Validate username
    if (!userName) {
      Alert.alert('Error', 'Username not found. Please try logging in again.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        author_id: user.id,
        username: isAnonymous ? 'Anonymous' : userName,
        question: question,
        year: year,
        paper: paper,
        question_id: questionId,
        is_anonymous: isAnonymous,
        images: images,
        like_count: 0,
        comment_count: 0,
        liked_by: [],
      };

      // Add post to Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLoading(false);

      // Navigate directly to PostDetail, replacing the current overlay in the stack
      // This prevents the user from going back to a stale CreatePostOverlay
      navigation.replace('PostDetail', { postId: data.id });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    navigation.navigate('FullScreenImageViewer', { imageUrl });
  };
  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <NormalText text="Share with your peers now!!" />

          {images.length > 0 && (
            <FixedImageCarousel
              images={images}
              onImagePress={handleImagePress}
            />
          )}

          <Checkbox
            isChecked={isAnonymous}
            onToggle={() => setIsAnonymous(!isAnonymous)}
            label="Post Anonymous"
          />
          <DisclaimerText text="*Your username will not be shown" />

          <PrimaryButton
            title="Post"
            isActive={true}
            submitHandler={postButtonHandler}
          />
          <SecondaryButton
            title="Cancel"
            isActive={true}
            submitHandler={overlayButtonHandler}
          />
        </ScrollView>
      </View>
      <FullScreenLoader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '85%',
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    borderColor: '#CCCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  inputColorLight: {
    color: '#50555C',
  },
  inputColorDark: {
    color: '#CCCC',
  },
});

export default CreatePostOverlay;
