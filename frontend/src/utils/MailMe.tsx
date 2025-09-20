import { Linking, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export const reportIssue = async () => {
  const to = 'dokidoki.cse@gmail.com';
  const subject = 'Issue Report';
  const body = 'Hi,\n\nI would like to report an issue...';

  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      // On Android, canOpenURL might return false even when email clients exist
      // Try opening anyway as a fallback
      if (Platform.OS === 'android') {
        try {
          await Linking.openURL(url);
        } catch (androidError) {
          showNoEmailClientAlert();
        }
      } else {
        showNoEmailClientAlert();
      }
    }
  } catch (error) {
    console.error('Error opening email client:', error);
    Alert.alert(
      'Error',
      'Unable to open email client. Please try again later.',
      [{ text: 'OK' }]
    );
  }
};

const showNoEmailClientAlert = () => {
  Alert.alert(
    'No Email Client',
    'No email client found. Please install an email app or contact us directly at:\n\ndokidoki.cse@gmail.com',
    [
      { text: 'OK' },
      {
        text: 'Copy Email',
        onPress: async () => {
          try {
            await Clipboard.setStringAsync('dokidoki.cse@gmail.com');
            Alert.alert(
              'Copied!',
              'Email address copied to clipboard',
              [{ text: 'OK' }]
            );
          } catch (error) {
            console.error('Failed to copy email to clipboard:', error);
            Alert.alert(
              'Copy Failed',
              'Could not copy email to clipboard. Please note: dokidoki.cse@gmail.com',
              [{ text: 'OK' }]
            );
          }
        }
      }
    ]
  );
};
