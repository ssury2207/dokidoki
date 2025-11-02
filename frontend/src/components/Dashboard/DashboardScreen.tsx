import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "./Components/DashboardHeader";
import DailyChallengeCard from "./Components/DailyChallengeCard";
import ProgressCard from "./Components/ProgressCard";
import { RootState, AppDispatch } from "@/store/store";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseConfig";
import {
  setCurrentStreak,
  setLastActiveDate,
  setLongestStreak,
  setPoints,
  setUserName,
  resetStreak,
} from "@/store/userProgressSlice";
import getDateDiffInDays from "@/src/utils/dateDifference";
import { reportIssue } from "@/src/utils/MailMe";
import DisclaimerText from "../atoms/DisclaimerText";
import OthersAnswersCard from "./Components/OthersAnswersCard";
import NotificationCard from "./Components/NotificationCard";
import * as Notifications from "expo-notifications";
import PrelimsPYQsQuestionCard from "./Components/PrelimsQuestionCard";
type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
  OthersAnswersList: undefined;
  PrelimsPyqScreen: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Dashboard">;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [userID, setUserID] = useState<string | null>(null);

  const PROJECT_ID = "9ba5a170-c777-4ade-a551-bb0f536c53b2";

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Get current user from Supabase auth (single call)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("❌ [DEBUG] No authenticated user found");
          return;
        }

        // Set user ID immediately
        setUserID(user.id);

        // Fetch user data from Supabase database
        const { data, error } = await supabase
          .from("users")
          .select(
            "username, total_points, current_streak, longest_streak, last_active_date"
          )
          .eq("id", user.id)
          .single();

        // If user doesn't exist in database (PGRST116 error), create profile
        if (error && error.code === "PGRST116") {
          console.log("⚠️ [DEBUG] User profile NOT found in database");
          console.log(
            "🔧 [DEBUG] FALLBACK TRIGGERED: Creating profile on first login..."
          );

          // Extract username from metadata or email
          const username =
            user.user_metadata?.username || user.email?.split("@")[0] || "User";
          const phoneNumber = user.user_metadata?.phone_number || null;

          // Create user profile
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: user.id,
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
            },
          ]);

          if (insertError) {
            console.log("❌ [DEBUG] Error creating user profile:", insertError);
            return;
          }

          // Set initial values in Redux
          dispatch(setUserName(username));
          dispatch(setPoints(0));
          dispatch(setCurrentStreak(0));
          dispatch(setLongestStreak());
          dispatch(setLastActiveDate(""));
          return;
        }

        if (error) {
          console.log("Error occurred while fetching user data:", error);
          return;
        }

        if (data) {
          // Dispatch data to Redux store
          dispatch(setUserName(data.username));
          dispatch(setPoints(data.total_points || 0));
          dispatch(setCurrentStreak(data.current_streak || 0));
          dispatch(setLongestStreak());
          dispatch(setLastActiveDate(data.last_active_date || ""));

          // Check if streak needs to be reset
          const last_active_date = data.last_active_date;
          const todays_date = new Date().toLocaleDateString("en-CA");
          if (last_active_date) {
            const diff = getDateDiffInDays(last_active_date, todays_date);
            if (diff > 1) {
              dispatch(resetStreak());
            }
          }
        }
      } catch (error) {
        console.log(
          "❌ [DEBUG] Error occurred while initializing user:",
          error
        );
      }
    };

    initializeUser();
  }, []); // run only on mount

  const handleStayUpdated = async () => {
    try {
      if (!userID) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      // Step 2: Request permissions and get device token
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive daily reminders."
        );
        return;
      }

      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: PROJECT_ID,
      });
      const token = tokenResponse.data;

      // Step 3: Check if token exists and save if needed
      const { data: existingTokens, error: queryError } = await supabase
        .from("push_tokens")
        .select("*")
        .eq("user_id", userID)
        .eq("token", token);

      if (queryError) {
        Alert.alert(
          "Error",
          "Failed to check existing notifications. Please try again."
        );
        return;
      }

      if (existingTokens && existingTokens.length > 0) {
        Alert.alert("DokiDoki", "Notifications are already enabled");
        return;
      }

      // Save new token
      const { error: insertError } = await supabase
        .from("push_tokens")
        .insert([{ user_id: userID, token: token }]);

      if (insertError) {
        Alert.alert(
          "Error",
          "Failed to enable notifications. Please try again."
        );
        return;
      }

      Alert.alert(
        "Success",
        "Notifications are now enabled! You'll receive daily reminders."
      );
    } catch (error) {
      console.log("❌ [DEBUG] Error in handleStayUpdated:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={theme ? styles.bodyDark : styles.bodyLight}>
      <ScrollView
        style={[
          { flex: 1 },
          theme
            ? { backgroundColor: "#222831" }
            : { backgroundColor: "#F5F5F5" },
        ]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />
        <DailyChallengeCard />
        <ProgressCard />
        <OthersAnswersCard
          onPress={() => navigation.navigate("OthersAnswersList")}
        />
        <PrelimsPYQsQuestionCard
          onPress={() => navigation.navigate("PrelimsPyqScreen")}
        />

        <NotificationCard onPress={handleStayUpdated} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with</Text>
          <Image
            source={require("../../../assets/heart.png")}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            by <Text style={styles.footerTeam}>dokidoki</Text> Team
          </Text>
        </View>
        <TouchableOpacity style={styles.linkContainer} onPress={reportIssue}>
          <Text style={styles.linkText}>
            Tap here to report an issue or send feedback
          </Text>
          <DisclaimerText text={"v1.3.0"} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bodyDark: {
    flex: 1,
    backgroundColor: "#222831",
  },
  bodyLight: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  themeToggleButton: {
    backgroundColor: "#00ADB5",
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 10,
  },
  themeToggleText: {
    color: "#EEEEEE",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    textAlign: "center",
    color: "#2650BB",
    fontWeight: "bold",
  },
  footerIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginHorizontal: 4,
  },
  footerTeam: {
    color: "#FF8358",
    fontWeight: "900",
  },
  linkContainer: {
    margin: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  linkText: {
    color: "#FF6347",
    borderColor: "#FF6347",
    borderBottomWidth: 1,
    fontWeight: "600",
    fontSize: 8,
  },
});

export default DashboardScreen;
