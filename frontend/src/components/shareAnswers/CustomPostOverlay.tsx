import { View, TextInput, ScrollView, Text } from 'react-native';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';
import { RootState, AppDispatch } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
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
import { uploadImageToCloudinary } from '@/src/api/uploadImageToCloudinary';
import { setCurrentStreak, setPoints, setLastActiveDate } from '@/store/userProgressSlice';
import Title from '../atoms/Title';

type CustomPostOverlayProps = NativeStackScreenProps<
  RootStackParamList,
  'CustomPostOverlay'
>;

const CustomPostOverlay = ({ navigation, route }: CustomPostOverlayProps) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const userName = useSelector(
    (state: RootState) => state.userProgress.userName
  );
  const points = useSelector((state: RootState) => state.userProgress.totalPoints);
  const curr_streak = useSelector((state: RootState) => state.userProgress.current_streak);
  const longest_streak = useSelector((state: RootState) => state.userProgress.longest_streak);
  const last_active_date = useSelector((state: RootState) => state.userProgress.last_active_date);

  const dispatch = useDispatch<AppDispatch>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionDescription, setQuestionDescription] = useState('');

  const { uid, uploadCopies } = route.params;
  const today = new Date().toISOString().substring(0, 10);

  const overlayButtonHandler = () => {
    navigation.goBack();
  };

  const postButtonHandler = async () => {
    // Validate question description
    if (!questionDescription.trim()) {
      Alert.alert('Required', 'Please describe the question you answered');
      return;
    }

    if (questionDescription.trim().length < 10) {
      Alert.alert('Too Short', 'Please provide a more detailed question description (at least 10 characters)');
      return;
    }

    // Validate images
    if (!uploadCopies || uploadCopies.length === 0) {
      Alert.alert('No Images', 'No images found. Please go back and upload images first.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload images to Cloudinary
      let downloadURLs: string[] = [];
      try {
        downloadURLs = await Promise.all(
          uploadCopies.map((img: { id: number; uri: string }) => uploadImageToCloudinary(img.uri))
        );
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        setLoading(false);
        Alert.alert("Failed to upload images", "Please check your internet connection and try again.");
        return;
      }

      // Step 2: Check if user has already been active today
      const already_active_today = last_active_date === today;

      // Step 3: Prepare points and streak updates
      const points_awarded = 5;
      const updated_points = points + points_awarded;
      // Only increment streak if NOT already active today
      const updated_streak = already_active_today ? curr_streak : curr_streak + 1;

      // Step 4: Update user stats in database
      try {
        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            total_points: updated_points,
            current_streak: updated_streak,
            longest_streak: Math.max(longest_streak, updated_streak),
            last_active_date: today,
            points_history: supabase.rpc("jsonb_set_custom", {
              data: {},
              key: today,
              value: points_awarded,
            }),
          })
          .eq("id", uid);

        if (userUpdateError) {
          console.error("User stats update error:", userUpdateError);
          // Still allow post creation even if stats update fails
        }
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        // Continue anyway
      }

      // Step 5: Update Redux state
      if (!already_active_today) {
        dispatch(setCurrentStreak(updated_streak));
      }
      dispatch(setPoints(updated_points));
      dispatch(setLastActiveDate(today));

      // Step 6: Validate username
      if (!userName) {
        setLoading(false);
        Alert.alert('Error', 'Username not found. Please try logging in again.');
        return;
      }

      // Step 7: Create post
      const postData = {
        author_id: uid,
        username: isAnonymous ? 'Anonymous' : userName,
        question: questionDescription.trim(),
        year: null,
        paper: null,
        question_id: null,
        post_type: 'custom_question', // Custom post type
        is_anonymous: isAnonymous,
        images: downloadURLs,
        like_count: 0,
        comment_count: 0,
        liked_by: [],
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        setLoading(false);
        console.error('Post creation error:', error);

        // Handle specific error codes
        if (error.code === '23505') {
          Alert.alert('Already Posted', 'You have already posted this answer.');
        } else if (error.code === '42703') {
          Alert.alert(
            'Database Update Required',
            'The app needs a database update. Please contact support or try again later.'
          );
        } else if (error.message.includes('permission')) {
          Alert.alert('Permission Denied', 'You do not have permission to create posts.');
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          Alert.alert('Connection Error', 'Please check your internet connection and try again.');
        } else {
          Alert.alert('Post Failed', `Unable to create post: ${error.message || 'Unknown error'}`);
        }
        return;
      }

      if (!data) {
        setLoading(false);
        Alert.alert('Post Failed', 'Unable to create post. No data returned. Please try again.');
        return;
      }

      setLoading(false);

      // Show message if already active today
      if (already_active_today) {
        Alert.alert("Great job!", "You've already earned your streak for today. This submission will earn you points but won't affect your streak.");
      }

      // Navigate to PostDetail, replacing all previous screens
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Dashboard' },
          { name: 'PostDetail', params: { postId: data.id } }
        ],
      });
    } catch (error: any) {
      setLoading(false);
      console.error('Unexpected post creation error:', error);
      Alert.alert(
        'Unexpected Error',
        `Something went wrong: ${error?.message || 'Unknown error'}. Please try again.`
      );
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
          <Title title="Create Your Post" />
          <NormalText text="Share your answer with the community!" />

          {uploadCopies.length > 0 && (
            <FixedImageCarousel
              images={uploadCopies.map(img => img.uri)}
              onImagePress={handleImagePress}
            />
          )}

          <Text style={[
            styles.label,
            { color: theme ? '#EEEEEE' : '#50555C' }
          ]}>
            Describe the question you answered:
          </Text>
          <TextInput
            style={[
              styles.inputStyle,
              theme ? styles.inputColorDark : styles.inputColorLight,
            ]}
            placeholder="E.g., Discuss the impact of climate change on agriculture"
            placeholderTextColor={theme ? '#888' : '#AAA'}
            value={questionDescription}
            onChangeText={setQuestionDescription}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          <DisclaimerText text={`${questionDescription.length}/200 characters`} />

          <Checkbox
            isChecked={isAnonymous}
            onToggle={() => setIsAnonymous(!isAnonymous)}
            label="Post Anonymous"
          />
          <DisclaimerText text="*Your username will not be shown" />

          <PrimaryButton
            title="Post"
            isActive={questionDescription.trim().length >= 10}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  inputStyle: {
    borderColor: '#CCCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputColorLight: {
    color: '#50555C',
  },
  inputColorDark: {
    color: '#EEEEEE',
  },
});

export default CustomPostOverlay;
