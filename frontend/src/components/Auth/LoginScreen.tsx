import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TypewriterText from '../common/TypewriterText';
import FullScreenLoader from '../common/FullScreenLoader';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (loaderVisible) return;
    setError('');
    setLoaderVisible(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoaderVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight + insets.top}
        style={styles.kavContainer}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require('../../../assets/dokidoki.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.cardContainer}>
              <TypewriterText
                text={`In which year was the first Lok Sabha constituted? (2016)`}
                speed={40}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loaderVisible}
              style={[
                styles.button,
                {
                  backgroundColor: '#00ADB5',
                  opacity: loaderVisible ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.buttonText}>
                {loaderVisible ? 'Please wait…' : 'LOGIN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupRow}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupText}>
                Don't have an Account?{' '}
                <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={loaderVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    width: '100%',
    marginTop: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 14,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    marginBottom: 24,
    borderRadius: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
  },
  signupText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  signupLink: {
    fontSize: 16,
    color: '#2650BB',
    fontWeight: '300',
    marginLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});
