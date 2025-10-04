import { supabase } from "../../supabaseConfig";
import { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TypewriterText from "../common/TypewriterText";
import FullScreenLoader from "../common/FullScreenLoader";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const allFilled =
      email.trim() !== "" &&
      password.trim() !== "" &&
      username.trim() !== "" &&
      phonenumber.trim() !== "";

    setDisabled(!allFilled);
  }, [email, password, username, phonenumber]);

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      // 1. Sign up the user with Supabase Auth (with metadata)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            username: username,
            phone_number: phonenumber,
          },
        },
      });

      if (authError) {
        // Handle specific signup errors with user-friendly messages
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please login instead.");
        } else if (authError.message.includes("Password should be")) {
          setError("Password must be at least 6 characters long.");
        } else if (authError.message.includes("Invalid email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(`Signup failed: ${authError.message}`);
        }
        return;
      }

      if (!authData.user) {
        setError("Signup failed. Please try again.");
        return;
      }

      // Check if email confirmation is required
      if (!authData.session) {
        // Email confirmation required - navigate to confirmation screen
        // User profile will be created AFTER email confirmation
        navigation.replace("EmailConfirmation", {
          email: email.trim(),
          username: username,
          phoneNumber: phonenumber,
        });
        return;
      }

      // If no confirmation needed (email confirmation disabled)
      // Create profile immediately
      const user_id = authData.user.id;

      await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const userData = {
        id: user_id,
        username: username,
        phone_number: phonenumber,
        longest_streak: 0,
        current_streak: 0,
        last_active_date: null,
        dates_active: {},
        total_solved: 0,
        pre_submissions: {},
        mains_answer_copies: {},
        total_points: 0,
        points_history: {},
      };

      const { error: dbError } = await supabase
        .from('users')
        .insert([userData]);

      if (dbError) {
        // Don't show technical database errors to user
        setError("Failed to create your profile. Please try again.");
        // Silent logging if needed for debugging
        // console.log("Profile creation error:", dbError);
      }
      // Success - user will be logged in via AuthContext
    } catch (e: any) {
      // Handle unexpected errors gracefully
      setError("An unexpected error occurred. Please try again.");
      // Silent logging if needed for debugging
      // console.log("Signup error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight + insets.top}
        style={styles.kavContainer}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                source={require("../../../assets/dokidoki.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.cardContainer}>
                <TypewriterText
                  text={`Explain the significance of the Non-Cooperation Movement in India's freedom struggle. (2017)`}
                  speed={40}
                />
              </View>
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="#999"
                value={username}
                maxLength={10}
                onChangeText={setUserName}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                maxLength={13}
                value={phonenumber}
                keyboardType="numeric"
                onChangeText={setPhonenumber}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                style={[styles.button, styles.signupButton]}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Please wait…" : "SIGN UP "}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alreadyAccountContainer}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.alreadyAccountText}>
                  Already Have an account?
                  <Text style={styles.loginText}> Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9ED",
  },
  kavContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    marginTop: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 14,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    width: "100%",
    marginBottom: 24,
    borderRadius: 20,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: "#000",
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: "50%",
    marginVertical: 15,
  },
  signupButton: {
    backgroundColor: "#00ADB5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  alreadyAccountContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  alreadyAccountText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  loginText: {
    color: "#2650BB",
    fontWeight: "300",
    fontSize: 16,
  },
});
