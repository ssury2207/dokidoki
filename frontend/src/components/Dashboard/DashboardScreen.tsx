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
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
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
type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Dashboard">;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const docRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          dispatch(setUserName(data?.username));
          dispatch(setPoints(data?.points.total_points));
          dispatch(setCurrentStreak(data?.streak.current_streak));
          dispatch(setLongestStreak(data?.streak.longest_streak));
          dispatch(setLastActiveDate(data?.streak.last_active_date));
          const last_active_date = data?.streak?.last_active_date;
          const todays_date = new Date().toLocaleDateString("en-CA");
          if (last_active_date) {
            const diff = getDateDiffInDays(last_active_date, todays_date);
            if (diff > 1) {
              dispatch(resetStreak());
            }
          }
        }
      } catch (error) {
        console.log("Error occurred while fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // run only on mount

  return (
    <SafeAreaView style={theme ? styles.bodyDark : styles.bodyLight}>
      <ScrollView
        style={[
          styles.scroll,
          theme
            ? { backgroundColor: "#222831" }
            : { backgroundColor: "#F5F5F5" },
        ]}
      >
        <DashboardHeader />
        <DailyChallengeCard />
        <ProgressCard />

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
    paddingVertical: 40,
    paddingHorizontal: 24,
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
    flex: 1,
    margin: 8,
    alignItems: "center",
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
