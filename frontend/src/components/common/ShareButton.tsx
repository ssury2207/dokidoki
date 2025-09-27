import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import NormalText from "../atoms/NormalText";
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
          theme ? styles.borderBgDark : styles.borderBgLight,
        ]}
      >
        <NormalText text="Share this Question Now!" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  borderBgLight: {
    borderColor: "#B3B4B7",
  },
  borderBgDark: {
    borderColor: "#108174",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ShareButton;
