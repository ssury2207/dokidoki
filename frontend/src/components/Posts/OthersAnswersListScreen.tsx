import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/src/supabaseConfig";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/types/navigation";
import FullScreenLoader from "@/src/components/common/FullScreenLoader";

// Types
export type Post = {
  id: string;
  question: string;
  username: string;
  created_at: string;
  like_count: number;
  hidepost: boolean;
};

type Nav = StackNavigationProp<RootStackParamList, "OthersAnswersList">;

const PAGE_SIZE = 10;

export default function OthersAnswersListScreen() {
  const navigation = useNavigation<Nav>();
  const isLight = useSelector((s: RootState) => s.theme.isLight);
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"created_at" | "like_count">(
    "created_at"
  );
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);

  const formatDate = useCallback((createdAt: string) => {
    try {
      if (!createdAt) return "";
      return new Date(createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, []);

  const fetchPosts = useCallback(
    async (page: number, sort: "created_at" | "like_count") => {
      setLoading(true);
      try {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // Fetch posts with pagination, excluding hidden posts (hidepost = null or true)
        const { data, error, count } = await supabase
          .from("posts")
          .select("id, question, username, created_at, like_count, hidepost", {
            count: "exact",
          })
          .eq("hidepost", false) // Only show posts where hidepost is explicitly false
          .order(sort, { ascending: false })
          .range(from, to);

        if (error) {
          console.log("Error fetching posts:", error);
          setPosts([]);
          setHasNext(false);
          return;
        }

        setPosts(data || []);

        // Check if there are more pages
        if (count) {
          const totalPages = Math.ceil(count / PAGE_SIZE);
          setHasNext(page < totalPages - 1);
        } else {
          setHasNext(false);
        }
      } catch (error) {
        console.log("Error fetching posts:", error);
        setPosts([]);
        setHasNext(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading) return;
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    await fetchPosts(nextPage, sortBy);
  }, [hasNext, loading, pageIndex, sortBy, fetchPosts]);

  const fetchPrev = useCallback(async () => {
    if (pageIndex <= 0 || loading) return;
    const prevPage = pageIndex - 1;
    setPageIndex(prevPage);
    await fetchPosts(prevPage, sortBy);
  }, [pageIndex, loading, sortBy, fetchPosts]);

  // Reset and fetch first page when sort changes
  useEffect(() => {
    setPageIndex(0);
    fetchPosts(0, sortBy);
  }, [sortBy, fetchPosts]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      const date = formatDate(item.created_at);
      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isLight ? "#393E46" : "#FFFFFF",
              shadowColor: isLight ? "#FFF" : "#000",
            },
          ]}
          onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.question, { color: !isLight ? "#000" : "#EEE" }]}
            numberOfLines={2}
          >
            {item.question}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[styles.metaText, { color: !isLight ? "#555" : "#DDD" }]}
            >
              {item.username}
            </Text>
            <View style={styles.rightMetaRow}>
              <Text
                style={[styles.metaText, { color: !isLight ? "#555" : "#DDD" }]}
              >
                {date}
              </Text>
              <View style={styles.likeRow}>
                <Text
                  style={[
                    styles.likeCountNum,
                    { color: !isLight ? "#555" : "#666" },
                  ]}
                  numberOfLines={1}
                >
                  {item.like_count ?? 0}
                </Text>
                <Text
                  style={[
                    styles.heart,
                    {
                      color:
                        item.like_count > 0
                          ? "#FF3B30"
                          : !isLight
                          ? "#888"
                          : "#999",
                    },
                  ]}
                >
                  {item.like_count > 0 ? "♥" : "♡"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [formatDate, isLight, navigation]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: !isLight ? "#F0F0F0" : "#222831" },
      ]}
    >
      {/* Header with sort toggle */}
      <View style={styles.header}>
        <Text
          style={[styles.headerLabel, { color: !isLight ? "#000" : "#EEE" }]}
        >
          Sort by:
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            { backgroundColor: !isLight ? "#FFF" : "#393E46" },
          ]}
          onPress={() => setSortMenuOpen(true)}
        >
          <Text style={{ color: !isLight ? "#000" : "#EEE" }}>
            {sortBy === "created_at" ? "Recency" : "Likes"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown modal */}
      <Modal
        visible={sortMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.sortOverlay}
          activeOpacity={1}
          onPress={() => setSortMenuOpen(false)}
        >
          <View
            style={[
              styles.sortCard,
              { backgroundColor: isLight ? "#FFFFFF" : "#2C2C2C" },
            ]}
            // stop propagation to avoid closing when tapping inside
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortMenuOpen(false);
                if (sortBy !== "created_at") setSortBy("created_at");
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: isLight ? "#000" : "#EEE",
                    fontWeight: sortBy === "created_at" ? "700" : "500",
                  },
                ]}
              >
                Recency
              </Text>
            </TouchableOpacity>
            <View style={styles.sortDivider} />
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortMenuOpen(false);
                if (sortBy !== "like_count") setSortBy("like_count");
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: isLight ? "#000" : "#EEE",
                    fontWeight: sortBy === "like_count" ? "700" : "500",
                  },
                ]}
              >
                Likes
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* List */}
      <FlatList
        style={styles.listContainer}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first one to share your answer!
              </Text>
            </View>
          ) : null
        }
      />

      {/* Full-screen loader overlay */}
      <FullScreenLoader visible={loading} message="Loading posts..." />

      {/* Pagination Controls */}
      <View
        style={[
          styles.pagination,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={[styles.navButton, pageIndex <= 0 && { opacity: 0.5 }]}
          disabled={pageIndex <= 0 || loading}
          onPress={fetchPrev}
        >
          <Text style={styles.navText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>Page {pageIndex + 1}</Text>
        <TouchableOpacity
          style={[styles.navButton, !hasNext && { opacity: 0.5 }]}
          disabled={!hasNext || loading}
          onPress={fetchNext}
        >
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: "bold",
  },
  dropdown: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    alignItems: "center",
    paddingBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
  },
  rightMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  heart: {
    fontSize: 14,
    marginRight: 4,
  },
  likeCountNum: {
    width: 28,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  navButton: {
    backgroundColor: "#00ADB5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  pageIndicator: {
    color: "#666",
    fontWeight: "600",
  },
  // Sort dropdown styles
  sortOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  sortCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sortOptionText: {
    fontSize: 16,
  },
  sortDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#888",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#AAA",
  },
});
