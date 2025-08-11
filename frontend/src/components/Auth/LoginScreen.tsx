import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [loaderVisible, setLoaderVisible] = useState(false); // start hidden

  const handleLogin = async () => {
    if (loaderVisible) return; // guard against double taps
    setError('');
    setLoaderVisible(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // success: loader will be hidden in finally; you may navigate on auth state change elsewhere
    } catch (e: any) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoaderVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
              backgroundColor: loaderVisible ? '#108174' : '#00ADB5',
              opacity: loaderVisible ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {loaderVisible ? 'Please wait…' : 'LOGIN'}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Text
            style={[styles.buttonText, { color: 'black', fontWeight: '600' }]}
          >
            Create an Account
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={[
                styles.buttonText,
                { color: '#2650BB', fontWeight: '300' },
              ]}
            >
              {' '}
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FullScreenLoader visible={loaderVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FEF9ED',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: '50%',
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
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
  typewriterText: {
    fontSize: 16,
    fontFamily: 'monospace',
    padding: 10,
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
