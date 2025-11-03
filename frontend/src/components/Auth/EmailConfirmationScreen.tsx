import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
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

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("✅ Confirmation email resent!\n\nPlease check your inbox and spam folder.");
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

  const handleGoToLogin = async () => {
    // Clear pending data and go to login
    await AsyncStorage.removeItem(PENDING_USER_KEY);
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require("../../../assets/dokidoki.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.emailIcon}>✉️</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Check Your Email</Text>

        {/* Email Display */}
        <View style={styles.emailBox}>
          <Text style={styles.emailLabel}>Verification email sent to:</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Step-by-Step Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Follow these steps:</Text>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Open your email inbox</Text>
              <Text style={styles.stepDescription}>
                Check the email address above. Look in spam if you don't see it.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Click the verification button</Text>
              <Text style={styles.stepDescription}>
                Click the "Verify My Email" button in the email we sent you.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Return here and login</Text>
              <Text style={styles.stepDescription}>
                After confirming, come back to this app and click "Go to Login" below.
              </Text>
            </View>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteIcon}>ℹ️</Text>
          <Text style={styles.noteText}>
            Your account will be activated only after you verify your email address.
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGoToLogin}
        >
          <Text style={styles.primaryButtonText}>
            ✓ I've Verified - Go to Login
          </Text>
        </TouchableOpacity>

        {/* Resend Email Link */}
        <TouchableOpacity
          style={styles.textButton}
          onPress={handleResendEmail}
        >
          <Text style={styles.textButtonText}>
            Didn't receive the email? <Text style={styles.textButtonLink}>Resend</Text>
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Need to make changes?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Secondary Actions */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleChangeEmail}
        >
          <Text style={styles.secondaryButtonText}>Use Different Email</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <Text style={styles.helpText}>
            • Check your spam/junk folder{'\n'}
            • Make sure the email address is correct{'\n'}
            • Try resending the verification email{'\n'}
            • Wait a few minutes for the email to arrive
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9ED",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emailIcon: {
    fontSize: 35,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222831",
    marginBottom: 20,
    textAlign: "center",
  },
  emailBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#00ADB5",
  },
  emailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00ADB5",
    textAlign: "center",
  },
  instructionsContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222831",
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00ADB5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222831",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFE69C",
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#856404",
    lineHeight: 18,
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#00ADB5",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#00ADB5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  textButton: {
    paddingVertical: 8,
    marginBottom: 20,
  },
  textButtonText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  textButtonLink: {
    color: "#00ADB5",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: "#999",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00ADB5",
    alignItems: "center",
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: "#00ADB5",
    fontSize: 15,
    fontWeight: "600",
  },
  helpContainer: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222831",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
  },
});
