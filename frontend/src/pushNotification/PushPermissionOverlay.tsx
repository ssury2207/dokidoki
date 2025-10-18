import { Modal, View } from "react-native";
import Title from "../components/atoms/Title";
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

const PushPermissionOverlay = ({ onClose }: PushPermissionOverlayProps) => {
  const navigation = useNavigation();
  const streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const [userID, setUserID] = useState(null);

  const theme = useSelector((state: RootState) => state.theme.isLight);
  useEffect(() => {
    const getUserID = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserID(user?.id);
    };
    getUserID();
  }, []);

  const getDeviceToken = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync(); // ✅ Fix typo

      if (status === "granted") {
        // ✅ Use === instead of ==
        const tokenResponse = await Notifications.getExpoPushTokenAsync(); // ✅ Fix typo
        return tokenResponse.data;
      } else {
        console.log("Permission denied");
        return null;
      }
    } catch (error) {
      console.error("Error getting device token:", error);
      return null;
    }
  };
  const overlayButtonHandler = async () => {
    if (!userID) {
      console.log("invalid id");
      return;
    }

    const token = await getDeviceToken();
    if (!token) {
      console.log("invalid device token");
      return;
    }

    const checkTokenExists = async (userID, token) => {
      const { data } = await supabase
        .from("push_tokens")
        .select("*")
        .eq("user_id", userID)
        .eq("token", token);
      return data?.length > 0;
    };
    const tokenExistsOnSupabase = await checkTokenExists(userID, token);
    if (!tokenExistsOnSupabase) {
      const { error } = await supabase.from("push_tokens").insert([
        {
          user_id: userID,
          token: token,
        },
      ]);

      if (error) {
        console.error("Error saving token:", error);
      }
    }

    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <NormalText text="Get notified when new questions are available" />
        <PrimaryButton
          isActive={true}
          submitHandler={overlayButtonHandler}
          title="Enable Notifications"
        />
        <SecondaryButton
          isActive={true}
          submitHandler={() => onClose ? onClose() : navigation.goBack()}
          title="Skip for now"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

export default PushPermissionOverlay;
