import { auth, firestore } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const allFilled =
      email.trim() !== '' &&
      password.trim() !== '' &&
      username.trim() !== '' &&
      phonenumber.trim() !== '';

    setDisabled(!allFilled);
  }, [email, password, username, phonenumber]);

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user_id = userCred.user.uid;
      const userData = {
        username: username,
        phoneNumber: phonenumber,
        streak: {
          longest_streak: 0,
          current_streak: 0,
          last_active_date: null,
          dates_active: {},
        },
        submissions: {
          total_solved: 0,
          pre: {},
          mains: {
            answerCopies: {
              
            }
          },
        },
        points: {
          total_points: 0,
          today: {
            pre: {
              amount: 0,
              timestamp: null,
            },
            mains: {
              amount: 0,
              timestamp: null,
            },
          },
          history: {
            // Later populated as: "2025-07-29": { pre: 2, mains: 3 }
          },
        },
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, 'users', user_id), userData);
    } catch (e) {
      setError(`Error:- ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={username}
          maxLength={10}
          onChangeText={setUserName}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          maxLength={13}
          value={phonenumber}
          keyboardType="numeric"
          onChangeText={setPhonenumber}
        />
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
        <Button
          disabled={disabled || loading}
          title="Sign Up"
          onPress={handleSignup}
        />
        <Button title="Back to Login" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertical centering
    alignItems: 'center', // Horizontal centering
    backgroundColor: '#f0f0f0', // Optional: subtle background
  },
  form: {
    width: '80%',
    alignItems: 'center',
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
