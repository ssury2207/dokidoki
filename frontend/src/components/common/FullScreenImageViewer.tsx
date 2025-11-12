import React, { useState, useRef } from "react";
import { View, Image, StyleSheet, ScrollView, Text, Dimensions } from "react-native";
import ShimmerPlaceholder from "./ShimmerComponent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FullScreenImageViewer = ({ route, navigation }) => {
  const { imageUrl, images, initialIndex } = route.params;

  // If images array is provided, use it. Otherwise, use single imageUrl
  const imageList = images || [imageUrl];
  const startIndex = initialIndex || 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const scrollViewRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const pageIndex = Math.round(contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(pageIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: startIndex * SCREEN_WIDTH, y: 0 }}
      >
        {imageList.map((url, index) => (
          <View key={index} style={styles.imageContainer}>
            <ShimmerPlaceholder
              visible={loadedImages.has(index)}
              borderRadius={0}
              containerStyle={styles.image}
            >
              <Image
                source={{ uri: url }}
                style={styles.image}
                resizeMode="contain"
                onLoad={() => setLoadedImages((prev) => new Set(prev).add(index))}
              />
            </ShimmerPlaceholder>
          </View>
        ))}
      </ScrollView>

      {imageList.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {imageList.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  counter: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FullScreenImageViewer;
