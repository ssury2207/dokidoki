import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Share } from "react-native";

type Props = {
  question: string;
};

const ShareButton: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const share = async () => {
    try {
      const result = await Share.share({
        message: `Check out this question on DokiDoki App! \n${props.question} \nTry it 👉 https://dokidoki-wine.vercel.app`,
      });

      if (result.action === Share.sharedAction) {
        console.log("Shared!");
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={share}
        style={[
          styles.button,
          theme ? styles.buttonLight : styles.buttonDark,
        ]}
        activeOpacity={0.8}
      >
        <Text style={styles.shareIcon}>📤</Text>
        <Text style={styles.buttonText}>Share this Question Now!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  buttonLight: {
    backgroundColor: "transparent",
    borderColor: "#FFC618",
  },
  buttonDark: {
    backgroundColor: "transparent",
    borderColor: "#37B9C5",
  },
  shareIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: "#37B9C5",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ShareButton;
