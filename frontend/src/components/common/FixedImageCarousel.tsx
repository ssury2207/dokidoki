import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface FixedImageCarouselProps {
  images: (string | any)[];
  onImagePress: (imageUrl: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = screenWidth - 48;

const FixedImageCarousel: React.FC<FixedImageCarouselProps> = ({
  images,
  onImagePress,
}) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageIndex = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageIndex);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * ITEM_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const getImageSource = (image: string | any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  const getImageUrl = (image: string | any) => {
    if (typeof image === 'string') {
      return image;
    }
    return Image.resolveAssetSource(image).uri;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => onImagePress(getImageUrl(image))}
          >
            <Image 
              source={getImageSource(image)} 
              style={styles.image} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                currentIndex === index
                  ? theme
                    ? styles.activeDotDark
                    : styles.activeDotLight
                  : theme
                  ? styles.inactiveDotDark
                  : styles.inactiveDotLight,
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContainer: {
    alignItems: "center",
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: 250,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotDark: {
    backgroundColor: "#FFC618",
  },
  activeDotLight: {
    backgroundColor: "#37B9C5",
  },
  inactiveDotDark: {
    backgroundColor: "#555555",
  },
  inactiveDotLight: {
    backgroundColor: "#CCCCCC",
  },
});

export default FixedImageCarousel;