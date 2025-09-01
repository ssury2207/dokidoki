import { Linking } from 'react-native';

export const reportIssue = async () => {
  const to = 'dokidoki.cse@gmail.com'; // ← your custom mail here
  const subject = 'Issue Report';
  const body = 'Hi,\n\nI’d like to report an issue...';

  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn('No email client available');
  }
};
