import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { supabase } from "@/src/supabaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  EmailConfirmation: { email: string; username: string; phoneNumber: string };
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "EmailConfirmation">;
  route: RouteProp<AuthStackParamList, "EmailConfirmation">;
};

const PENDING_USER_KEY = "pending_user_data";

export default function EmailConfirmationScreen({ navigation, route }: Props) {
  const { email, username, phoneNumber } = route.params;
  const [checking, setChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Save pending user data to AsyncStorage
  useEffect(() => {
    const savePendingUserData = async () => {
      await AsyncStorage.setItem(
        PENDING_USER_KEY,
        JSON.stringify({ email, username, phoneNumber })
      );
    };
    savePendingUserData();
  }, [email, username, phoneNumber]);

  // Check for email confirmation every 3 seconds
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      setChecking(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.email_confirmed_at) {
          // Email is confirmed! Create user profile
          await createUserProfile(user.id, username, phoneNumber);

          // Clear pending data
          await AsyncStorage.removeItem(PENDING_USER_KEY);

          // User will be automatically logged in via AuthContext
          console.log("Email confirmed! User logged in.");
        }
      } catch (error) {
        console.error("Error checking confirmation:", error);
      } finally {
        setChecking(false);
      }
    };

    // Check immediately, then every 3 seconds
    checkEmailConfirmation();
    const interval = setInterval(() => {
      setCheckCount(prev => prev + 1);
      checkEmailConfirmation();
    }, 3000);

    return () => clearInterval(interval);
  }, [username, phoneNumber]);

  const createUserProfile = async (
    userId: string,
    username: string,
    phoneNumber: string
  ) => {
    try {
      const userData = {
        id: userId,
        username: username,
        phone_number: phoneNumber,
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

      const { error } = await supabase.from("users").insert([userData]);

      if (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }

      console.log("User profile created successfully!");
    } catch (error) {
      console.error("Failed to create user profile:", error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Confirmation email resent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Failed to resend email. Please try again.");
    }
  };

  const handleChangeEmail = async () => {
    // Clear pending data and go back to signup
    await AsyncStorage.removeItem(PENDING_USER_KEY);
    navigation.replace("Signup");
  };

  const handleLoginInstead = async () => {
    // Clear pending data and go to login
    await AsyncStorage.removeItem(PENDING_USER_KEY);
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("../../../assets/dokidoki.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.emailIcon}>📧</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Your Email</Text>

        {/* Description */}
        <Text style={styles.description}>
          We've sent a confirmation email to:
        </Text>
        <Text style={styles.email}>{email}</Text>

        <Text style={styles.instruction}>
          Please check your inbox and click the confirmation link to continue.
        </Text>

        {/* Checking Status */}
        {checking && (
          <View style={styles.checkingContainer}>
            <ActivityIndicator size="small" color="#00ADB5" />
            <Text style={styles.checkingText}>
              Checking for confirmation...
            </Text>
          </View>
        )}

        {/* Resend Email Button */}
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendEmail}
        >
          <Text style={styles.resendButtonText}>Resend Confirmation Email</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleChangeEmail}
        >
          <Text style={styles.secondaryButtonText}>Change Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleLoginInstead}
        >
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Didn't receive the email? Check your spam folder or try resending.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9ED",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emailIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222831",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00ADB5",
    textAlign: "center",
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  checkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#E8F5F6",
    borderRadius: 8,
  },
  checkingText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#00ADB5",
    fontWeight: "500",
  },
  resendButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#00ADB5",
    borderRadius: 10,
    marginBottom: 24,
    width: "100%",
    alignItems: "center",
  },
  resendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00ADB5",
  },
  secondaryButtonText: {
    color: "#00ADB5",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
