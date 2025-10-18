import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
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
import NormalText from "../atoms/NormalText";
import OthersAnswersCard from "./Components/OthersAnswersCard";
import * as Notifications from "expo-notifications";
import PushPermissionOverlay from "../../pushNotification/PushPermissionOverlay";
type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
  OthersAnswersList: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Dashboard">;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [showPushOverlay, setShowPushOverlay] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user from Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.log("❌ [DEBUG] No authenticated user found");
          return;
        }

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
          "❌ [DEBUG] Error occurred while fetching user data:",
          error
        );
      }
    };

    fetchUserData();
  }, []); // run only on mount

  useEffect(() => {
    const checkPushTokenStatus = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Check notification permissions
        const { status } = await Notifications.getPermissionsAsync();

        if (status === "granted") {
          // Get device token
          const tokenResponse = await Notifications.getExpoPushTokenAsync();
          const currentToken = tokenResponse.data;

          // Check if token exists in database
          const { data } = await supabase
            .from("push_tokens")
            .select("*")
            .eq("user_id", user.id)
            .eq("token", currentToken);

          // If token doesn't exist, insert it
          if (!data || data.length === 0) {
            await supabase
              .from("push_tokens")
              .insert([{ user_id: user.id, token: currentToken }]);
          }
        } else {
          // No permissions, show overlay
          setShowPushOverlay(true);
        }
      } catch (error) {
        console.error("Error checking push token status:", error);
      }
    };

    checkPushTokenStatus();
  }, []);

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
        <TouchableOpacity
          onPress={() => navigation.navigate("PushPermissionOverlay")}
        >
          <Text>pushme</Text>
        </TouchableOpacity>
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
        </TouchableOpacity>
      </ScrollView>
      {showPushOverlay && (
        <PushPermissionOverlay onClose={() => setShowPushOverlay(false)} />
      )}
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
