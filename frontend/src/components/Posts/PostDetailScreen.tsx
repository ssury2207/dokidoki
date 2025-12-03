import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "@/src/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/src/supabaseConfig";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/types/navigation";
import FullScreenLoader from "@/src/components/common/FullScreenLoader";
import { getCloudinaryThumbnail } from "@/src/utils/imageUtils";
import ShimmerPlaceholder from "@/src/components/common/ShimmerComponent";
import PostDetailsEvaluationCard from "./PostDetailsEvaluationCard";
import TextLabel from "../atoms/TextLabel";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;
type Nav = StackNavigationProp<RootStackParamList, "PostDetail">;

type DetailedPost = {
  id: string;
  question: string;
  username: string;
  author_id: string;
  created_at: string;
  like_count: number;
  images?: string[];
  is_anonymous?: boolean;
  paper?: string;
  year?: string;
  comment_count?: number;
  liked_by?: string[];
  discussionlocked?: boolean;
  time_taken: number;
};

type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  dislike_count: number;
  liked_by?: string[];
  disliked_by?: string[];
  is_edited: boolean;
  is_anonymous: boolean;
};

export default function PostDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;
  const isLight = useSelector((s: RootState) => s.theme.isLight);
  const userProgress = useSelector((s: RootState) => s.userProgress);
  const { user: currentUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [post, setPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likingPost, setLikingPost] = useState<boolean>(false);

  // Comment functionality
  const [commentText, setCommentText] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [likingComments, setLikingComments] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"created_at" | "like_count">(
    "created_at"
  );
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const MAX_COMMENT_LENGTH = 2000;

  const formatDate = useCallback((createdAt: string) => {
    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, []);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, discussionlocked")
        .eq("id", postId)
        .single();

      if (error || !data) {
        Alert.alert("Error", "Post not found");
        navigation.goBack();
        return;
      }

      setPost(data as DetailedPost);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Error", "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId, navigation]);

  const toggleLike = useCallback(async () => {
    if (!post || !currentUser?.id || likingPost) return;

    setLikingPost(true);
    try {
      const isLiked = post.liked_by?.includes(currentUser.id);
      const newLikedBy = isLiked
        ? post.liked_by?.filter((uid) => uid !== currentUser.id) || []
        : [...(post.liked_by || []), currentUser.id];

      const { error } = await supabase
        .from("posts")
        .update({
          like_count: isLiked
            ? Math.max(0, post.like_count - 1)
            : post.like_count + 1,
          liked_by: newLikedBy,
        })
        .eq("id", postId);

      if (error) throw error;

      setPost((prev) =>
        prev
          ? {
              ...prev,
              like_count: isLiked
                ? Math.max(0, prev.like_count - 1)
                : prev.like_count + 1,
              liked_by: newLikedBy,
            }
          : null
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like status");
    } finally {
      setLikingPost(false);
    }
  }, [post, currentUser?.id, postId, likingPost]);

  const submitComment = useCallback(async () => {
    if (
      !commentText.trim() ||
      !currentUser?.id ||
      submittingComment ||
      !post ||
      post.discussionlocked
    )
      return;

    if (commentText.length > MAX_COMMENT_LENGTH) {
      Alert.alert(
        "Error",
        `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`
      );
      return;
    }

    setSubmittingComment(true);
    try {
      const commentData = {
        post_id: postId,
        author_id: currentUser.id,
        author_username:
          userProgress.userName || currentUser.email?.split("@")[0] || "User",
        content: commentText.trim(),
        like_count: 0,
        dislike_count: 0,
        liked_by: [],
        disliked_by: [],
        is_edited: false,
        is_anonymous: false,
      };

      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([commentData])
        .select()
        .single();

      if (error) throw error;

      // Update post's comment count
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          comment_count: (post.comment_count || 0) + 1,
        })
        .eq("id", postId);

      if (updateError) throw updateError;

      // Add to local state
      setComments((prev) => [newComment as Comment, ...prev]);
      setPost((prev) =>
        prev ? { ...prev, comment_count: (prev.comment_count || 0) + 1 } : null
      );

      setCommentText("");
      Alert.alert("Success", "Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setSubmittingComment(false);
    }
  }, [commentText, currentUser?.id, submittingComment, postId, post]);

  const handleCommentTextChange = useCallback(
    (text: string) => {
      if (text.length <= MAX_COMMENT_LENGTH) {
        setCommentText(text);
      }
    },
    [MAX_COMMENT_LENGTH]
  );

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order(sortBy, { ascending: false });

      if (error) throw error;

      setComments((data as Comment[]) || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [postId, sortBy]);

  const toggleCommentLike = useCallback(
    async (commentId: string, currentlyLiked: boolean) => {
      if (!currentUser?.id || likingComments.has(commentId)) return;

      setLikingComments((prev) => new Set(prev).add(commentId));

      try {
        const currentComment = comments.find((c) => c.id === commentId);
        if (!currentComment) return;

        const wasDisliked =
          currentComment.disliked_by?.includes(currentUser.id) || false;
        const newLikedBy = currentlyLiked
          ? currentComment.liked_by?.filter((uid) => uid !== currentUser.id) ||
            []
          : [...(currentComment.liked_by || []), currentUser.id];

        const newDislikedBy =
          !currentlyLiked && wasDisliked
            ? currentComment.disliked_by?.filter(
                (uid) => uid !== currentUser.id
              ) || []
            : currentComment.disliked_by || [];

        const { error } = await supabase
          .from("comments")
          .update({
            like_count: currentlyLiked
              ? Math.max(0, currentComment.like_count - 1)
              : currentComment.like_count + 1,
            dislike_count:
              !currentlyLiked && wasDisliked
                ? Math.max(0, currentComment.dislike_count - 1)
                : currentComment.dislike_count,
            liked_by: newLikedBy,
            disliked_by: newDislikedBy,
          })
          .eq("id", commentId);

        if (error) throw error;

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  like_count: currentlyLiked
                    ? Math.max(0, comment.like_count - 1)
                    : comment.like_count + 1,
                  dislike_count:
                    !currentlyLiked && wasDisliked
                      ? Math.max(0, comment.dislike_count - 1)
                      : comment.dislike_count,
                  liked_by: newLikedBy,
                  disliked_by: newDislikedBy,
                }
              : comment
          )
        );
      } catch (error) {
        console.error("Error toggling comment like:", error);
      } finally {
        setLikingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
    [currentUser?.id, likingComments, comments]
  );

  const toggleCommentDislike = useCallback(
    async (commentId: string, currentlyDisliked: boolean) => {
      if (!currentUser?.id || likingComments.has(commentId)) return;

      setLikingComments((prev) => new Set(prev).add(commentId));

      try {
        const currentComment = comments.find((c) => c.id === commentId);
        if (!currentComment) return;

        const wasLiked =
          currentComment.liked_by?.includes(currentUser.id) || false;
        const newDislikedBy = currentlyDisliked
          ? currentComment.disliked_by?.filter(
              (uid) => uid !== currentUser.id
            ) || []
          : [...(currentComment.disliked_by || []), currentUser.id];

        const newLikedBy =
          !currentlyDisliked && wasLiked
            ? currentComment.liked_by?.filter(
                (uid) => uid !== currentUser.id
              ) || []
            : currentComment.liked_by || [];

        const { error } = await supabase
          .from("comments")
          .update({
            dislike_count: currentlyDisliked
              ? Math.max(0, currentComment.dislike_count - 1)
              : currentComment.dislike_count + 1,
            like_count:
              !currentlyDisliked && wasLiked
                ? Math.max(0, currentComment.like_count - 1)
                : currentComment.like_count,
            disliked_by: newDislikedBy,
            liked_by: newLikedBy,
          })
          .eq("id", commentId);

        if (error) throw error;

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  dislike_count: currentlyDisliked
                    ? Math.max(0, comment.dislike_count - 1)
                    : comment.dislike_count + 1,
                  like_count:
                    !currentlyDisliked && wasLiked
                      ? Math.max(0, comment.like_count - 1)
                      : comment.like_count,
                  disliked_by: newDislikedBy,
                  liked_by: newLikedBy,
                }
              : comment
          )
        );
      } catch (error) {
        console.error("Error toggling comment dislike:", error);
      } finally {
        setLikingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
    [currentUser?.id, likingComments, comments]
  );

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => {
      const isLiked = Boolean(item.liked_by?.includes(currentUser?.id || ""));
      const isDisliked = Boolean(
        item.disliked_by?.includes(currentUser?.id || "")
      );
      const commentDate = formatDate(item.created_at);
      const isLoading = likingComments.has(item.id);

      return (
        <View
          style={[
            styles.commentItem,
            { backgroundColor: !isLight ? "#F8F8F8" : "#2C2C2C" },
          ]}
        >
          <View style={styles.commentHeader}>
            <Text
              style={[
                styles.commentAuthor,
                { color: !isLight ? "#000" : "#EEE" },
              ]}
            >
              {item.is_anonymous ? "Anonymous" : item.author_username}
            </Text>
            <Text
              style={[
                styles.commentDate,
                { color: !isLight ? "#666" : "#AAA" },
              ]}
            >
              {commentDate}
            </Text>
          </View>

          <Text
            style={[
              styles.commentContent,
              { color: !isLight ? "#333" : "#DDD" },
            ]}
          >
            {item.content}
          </Text>

          <View style={styles.commentActions}>
            <TouchableOpacity
              style={[
                styles.commentActionButton,
                { opacity: isLoading ? 0.5 : 1 },
              ]}
              onPress={() => toggleCommentLike(item.id, isLiked)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isLiked ? "#00ADB5" : !isLight ? "#666" : "#AAA"}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.commentActionIcon,
                      {
                        color: isLiked ? "#00ADB5" : !isLight ? "#666" : "#AAA",
                      },
                    ]}
                  >
                    👍
                  </Text>
                  <Text
                    style={[
                      styles.commentActionText,
                      {
                        color: isLiked ? "#00ADB5" : !isLight ? "#666" : "#AAA",
                      },
                    ]}
                  >
                    {item.like_count}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.commentActionButton,
                { opacity: isLoading ? 0.5 : 1 },
              ]}
              onPress={() => toggleCommentDislike(item.id, isDisliked)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDisliked ? "#FF3B30" : !isLight ? "#666" : "#AAA"}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.commentActionIcon,
                      {
                        color: isDisliked
                          ? "#FF3B30"
                          : !isLight
                          ? "#666"
                          : "#AAA",
                      },
                    ]}
                  >
                    👎
                  </Text>
                  <Text
                    style={[
                      styles.commentActionText,
                      {
                        color: isDisliked
                          ? "#FF3B30"
                          : !isLight
                          ? "#666"
                          : "#AAA",
                      },
                    ]}
                  >
                    {item.dislike_count}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [
      currentUser?.id,
      isLight,
      formatDate,
      toggleCommentLike,
      toggleCommentDislike,
      likingComments,
    ]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPost(), fetchComments()]);
      setLoading(false);
    };

    fetchData();
  }, [postId]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [sortBy]);

  if (loading) {
    const message =
      loadingComments && post ? "Sorting reviews..." : "Loading post...";
    return <FullScreenLoader visible={loading} message={message} />;
  }

  if (!post) {
    return <FullScreenLoader visible={false} message="Post not found" />;
  }

  const isLiked = post.liked_by?.includes(currentUser?.id || "");
  const date = formatDate(post.created_at);
  const displayUsername = post.is_anonymous ? "Anonymous" : post.username;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: !isLight ? "#F0F0F0" : "#222831",
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Post Content */}
        <View
          style={[
            styles.postCard,
            { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
          ]}
        >
          {/* Question */}
          <Text
            style={[styles.question, { color: !isLight ? "#000" : "#EEE" }]}
          >
            {post.question}
          </Text>

          {/* Paper and Year */}
          {(post.paper || post.year) && (
            <View style={styles.paperInfo}>
              {post.paper && (
                <Text
                  style={[
                    styles.paperText,
                    { color: !isLight ? "#666" : "#AAA" },
                  ]}
                >
                  Paper: {post.paper}
                </Text>
              )}
              {post.year && (
                <Text
                  style={[
                    styles.paperText,
                    { color: !isLight ? "#666" : "#AAA" },
                  ]}
                >
                  Year: {post.year}
                </Text>
              )}
            </View>
          )}

          {/* Answer Images */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: !isLight ? "#000" : "#EEE" },
                ]}
              >
                Answer Images:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScrollView}
              >
                {post.images.map((imageUrl, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("FullScreenImageViewer", {
                        images: post.images,
                        initialIndex: index,
                      })
                    }
                    style={styles.imageContainer}
                  >
                    <ShimmerPlaceholder
                      visible={loadedImages.has(index)}
                      borderRadius={12}
                      containerStyle={styles.answerImage}
                    >
                      <Image
                        source={{ uri: getCloudinaryThumbnail(imageUrl) }}
                        style={styles.answerImage}
                        resizeMode="cover"
                        onLoad={() =>
                          setLoadedImages((prev) => new Set(prev).add(index))
                        }
                      />
                    </ShimmerPlaceholder>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {post.time_taken ? (
            <TextLabel text={`Time Taken:- ${post.time_taken} min`} />
          ) : (
            <></>
          )}

          {/* Meta Info */}
          <View style={styles.metaSection}>
            <View style={styles.userInfo}>
              <Text
                style={[styles.username, { color: !isLight ? "#333" : "#CCC" }]}
              >
                By: {displayUsername}
              </Text>
              <Text
                style={[styles.date, { color: !isLight ? "#666" : "#AAA" }]}
              >
                {date}
              </Text>
            </View>

            {/* Like Button */}
            <TouchableOpacity
              style={[
                styles.likeButton,
                { borderColor: !isLight ? "#DDD" : "#666" },
              ]}
              onPress={toggleLike}
              disabled={likingPost}
            >
              {likingPost ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#666"
                    style={styles.heartIcon}
                  />
                  <Text
                    style={[
                      styles.likeCount,
                      { color: !isLight ? "#666" : "#AAA" },
                    ]}
                  >
                    {post.like_count}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.heartIcon,
                      {
                        color: isLiked ? "#FF3B30" : !isLight ? "#666" : "#AAA",
                      },
                    ]}
                  >
                    {isLiked ? "♥" : "♡"}
                  </Text>
                  <Text
                    style={[
                      styles.likeCount,
                      { color: !isLight ? "#666" : "#AAA" },
                    ]}
                  >
                    {post.like_count}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Evaluation */}
        <PostDetailsEvaluationCard
          postID={post.id}
          authorID={post.author_id}
          currentUserID={currentUser?.id || ""}
        />
        {/* Comment Section */}
        <View
          style={[
            styles.commentSection,
            { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
          ]}
        >
          <Text
            style={[
              styles.commentSectionTitle,
              { color: !isLight ? "#000" : "#EEE" },
            ]}
          >
            {post.discussionlocked
              ? "Discussion Locked"
              : "Share your review about this answer:"}
          </Text>

          {post.discussionlocked ? (
            <View style={styles.lockedMessageContainer}>
              <Text
                style={[
                  styles.lockedMessage,
                  { color: !isLight ? "#666" : "#AAA" },
                ]}
              >
                Comments have been disabled for this post.
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.commentInputContainer,
                  { borderColor: !isLight ? "#DDD" : "#666" },
                ]}
              >
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      color: !isLight ? "#000" : "#EEE",
                      textAlignVertical: "top",
                    },
                  ]}
                  placeholder="Write your review about how well this question was answered..."
                  placeholderTextColor={!isLight ? "#999" : "#AAA"}
                  value={commentText}
                  onChangeText={handleCommentTextChange}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={MAX_COMMENT_LENGTH}
                />
              </View>

              <View style={styles.commentFooter}>
                <Text
                  style={[
                    styles.characterCounter,
                    {
                      color:
                        commentText.length > MAX_COMMENT_LENGTH * 0.9
                          ? "#FF3B30"
                          : !isLight
                          ? "#666"
                          : "#AAA",
                    },
                  ]}
                >
                  {commentText.length}/{MAX_COMMENT_LENGTH} characters
                </Text>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor:
                        commentText.trim().length > 0 && !submittingComment
                          ? "#00ADB5"
                          : !isLight
                          ? "#DDD"
                          : "#555",
                      opacity:
                        commentText.trim().length > 0 && !submittingComment
                          ? 1
                          : 0.5,
                    },
                  ]}
                  onPress={submitComment}
                  disabled={!commentText.trim() || submittingComment}
                >
                  {submittingComment ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Comments List */}
        <View
          style={[
            styles.commentsSection,
            { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
          ]}
        >
          <View style={styles.commentsHeader}>
            <Text
              style={[
                styles.commentsSectionTitle,
                { color: !isLight ? "#000" : "#EEE" },
              ]}
            >
              Reviews ({comments.length})
            </Text>
          </View>

          {/* Sort Header */}
          <View style={styles.sortHeader}>
            <Text
              style={[styles.sortLabel, { color: !isLight ? "#000" : "#EEE" }]}
            >
              Sort by:
            </Text>
            <TouchableOpacity
              style={[
                styles.sortDropdown,
                {
                  backgroundColor: !isLight ? "#FFF" : "#2C2C2C",
                  borderColor: !isLight ? "#DDD" : "#555",
                },
              ]}
              onPress={() => setSortMenuOpen(true)}
            >
              <Text style={{ color: !isLight ? "#000" : "#EEE" }}>
                {sortBy === "created_at" ? "Recency" : "Upvotes"}
              </Text>
            </TouchableOpacity>
          </View>

          {comments.length === 0 && !loadingComments ? (
            <View style={styles.noCommentsContainer}>
              <Text
                style={[
                  styles.noCommentsText,
                  { color: !isLight ? "#666" : "#AAA" },
                ]}
              >
                No reviews yet. Be the first to share your thoughts!
              </Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={styles.commentSeparator} />
              )}
            />
          )}
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
                  Upvotes
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  postCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    marginBottom: 16,
    marginVertical: 8,
  },
  paperInfo: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0, 173, 181, 0.1)",
    borderRadius: 8,
  },
  paperText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  imagesSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  imagesScrollView: {
    marginTop: 8,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  answerImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 0.75,
    borderRadius: 12,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  heartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentSection: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  commentInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  commentInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
    maxHeight: 150,
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  characterCounter: {
    fontSize: 12,
    fontWeight: "500",
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  commentsSection: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  noCommentsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noCommentsText: {
    fontSize: 14,
    textAlign: "center",
  },
  lockedMessageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  lockedMessage: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  commentItem: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentDate: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  commentActionIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentSeparator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 4,
  },
  sortHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: "600",
  },
  sortDropdown: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 80,
  },
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
});
