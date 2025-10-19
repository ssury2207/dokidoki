import { View, Alert } from "react-native";
import NormalText from "../components/atoms/NormalText";
import PrimaryButton from "../components/atoms/PrimaryButton";
import SecondaryButton from "../components/atoms/SecondaryButton";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import { supabase } from "../supabaseConfig";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

interface PushPermissionOverlayProps {
  onClose?: () => void;
}

const PROJECT_ID = '9ba5a170-c777-4ade-a551-bb0f536c53b2';

const PushPermissionOverlay = ({ onClose }: PushPermissionOverlayProps) => {
  const navigation = useNavigation();
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const getUserID = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserID(user?.id || null);
    };
    getUserID();
  }, []);

  // Helper to close overlay
  const closeOverlay = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  // Request permission and get token
  const getDeviceToken = async (): Promise<string | null> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: PROJECT_ID
        });
        return tokenResponse.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Main handler when user clicks "Enable Notifications"
  const handleEnableNotifications = async () => {
    // Validate user
    if (!userID) {
      Alert.alert("Error", "User not authenticated", [
        { text: "OK", onPress: closeOverlay }
      ]);
      return;
    }

    // Get device token
    const token = await getDeviceToken();

    if (!token) {
      // Permission denied or error
      Alert.alert("Permission Denied", "Notification permission was denied", [
        { text: "OK", onPress: closeOverlay }
      ]);
      return;
    }

    // Check if token exists in Supabase
    try {
      const { data: existingTokens, error: queryError } = await supabase
        .from("push_tokens")
        .select("*")
        .eq("user_id", userID)
        .eq("token", token);

      if (queryError) {
        Alert.alert("Error", "Failed to check token in database", [
          { text: "OK", onPress: closeOverlay }
        ]);
        return;
      }

      if (existingTokens && existingTokens.length > 0) {
        // Token already exists
        Alert.alert("", "Notifications are already turned on", [
          { text: "OK", onPress: closeOverlay }
        ]);
      } else {
        // Token doesn't exist, save it
        const { error: insertError } = await supabase.from("push_tokens").insert([
          {
            user_id: userID,
            token: token,
          },
        ]);

        if (insertError) {
          Alert.alert("", "Failed to save token to database", [
            { text: "OK", onPress: closeOverlay }
          ]);
        } else {
          Alert.alert("", "Notifications are enabled", [
            { text: "OK", onPress: closeOverlay }
          ]);
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred", [
        { text: "OK", onPress: closeOverlay }
      ]);
    }
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <NormalText text="Get notified when new questions are available" />
        <PrimaryButton
          isActive={true}
          submitHandler={handleEnableNotifications}
          title="Enable Notifications"
        />
        <SecondaryButton
          isActive={true}
          submitHandler={closeOverlay}
          title="Skip for now"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalBGLight: {
    backgroundColor: "white",
  },
  modalBGDark: {
    backgroundColor: "#222831",
  },
});

export default PushPermissionOverlay;
