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
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "@/src/firebaseConfig";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/types/navigation";
import FullScreenLoader from "@/src/components/common/FullScreenLoader";

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;
type Nav = StackNavigationProp<RootStackParamList, "PostDetail">;

type DetailedPost = {
  id: string;
  question: string;
  username: string;
  authorId: string;
  createdAt: { seconds: number } | { toDate: () => Date } | any;
  likeCount: number;
  images?: string[];
  isAnonymous?: boolean;
  paper?: string;
  year?: string;
  commentCount?: number;
  likedBy?: string[];
};

type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: { seconds: number } | { toDate: () => Date } | any;
  updatedAt: { seconds: number } | { toDate: () => Date } | any;
  likeCount: number;
  dislikeCount: number;
  likedBy?: string[];
  dislikedBy?: string[];
  isEdited: boolean;
  isAnonymous: boolean;
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
  const [sortBy, setSortBy] = useState<"createdAt" | "likeCount">("createdAt");
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);

  const MAX_COMMENT_LENGTH = 500;

  const formatDate = useCallback((createdAt: DetailedPost["createdAt"]) => {
    try {
      if (!createdAt) return "";
      if (typeof createdAt?.seconds === "number") {
        return new Date(createdAt.seconds * 1000).toLocaleString();
      }
      if (typeof createdAt?.toDate === "function") {
        return createdAt.toDate().toLocaleString();
      }
      return new Date(createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, []);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (postDoc.exists()) {
        const data = postDoc.data() as DetailedPost;
        const postData = { id: postDoc.id, ...data };
        setPost(postData);
      } else {
        Alert.alert("Error", "Post not found");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Error", "Failed to load post");
      setLoading(false);
    }
  }, [postId, navigation]);

  const toggleLike = useCallback(async () => {
    if (!post || !currentUser?.uid || likingPost) return;

    setLikingPost(true);
    try {
      const postRef = doc(db, "posts", postId);
      const isLiked = post.likedBy?.includes(currentUser.uid);

      if (isLiked) {
        await updateDoc(postRef, {
          likeCount: increment(-1),
          likedBy: arrayRemove(currentUser.uid),
        });
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likeCount: Math.max(0, prev.likeCount - 1),
                likedBy:
                  prev.likedBy?.filter((uid) => uid !== currentUser.uid) || [],
              }
            : null
        );
      } else {
        await updateDoc(postRef, {
          likeCount: increment(1),
          likedBy: arrayUnion(currentUser.uid),
        });
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likeCount: prev.likeCount + 1,
                likedBy: [...(prev.likedBy || []), currentUser.uid],
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like status");
    } finally {
      setLikingPost(false);
    }
  }, [post, currentUser?.uid, postId, likingPost]);

  const submitComment = useCallback(async () => {
    if (!commentText.trim() || !currentUser?.uid || submittingComment || !post)
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
      // Add comment to Firestore
      const commentData = {
        postId: postId,
        authorId: currentUser.uid,
        authorUsername:
          userProgress.userName ||
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "User",
        content: commentText.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likeCount: 0,
        dislikeCount: 0,
        likedBy: [],
        dislikedBy: [],
        isEdited: false,
        isAnonymous: false,
      };

      const docRef = await addDoc(collection(db, "comments"), commentData);

      // Update post's comment count
      await updateDoc(doc(db, "posts", postId), {
        commentCount: increment(1),
      });

      // Add to local state immediately for better UX
      const newComment: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setComments((prev) => [newComment, ...prev]);

      // Update post comment count locally
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
      );

      setCommentText("");
      Alert.alert("Success", "Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setSubmittingComment(false);
    }
  }, [
    commentText,
    currentUser?.uid,
    submittingComment,
    MAX_COMMENT_LENGTH,
    postId,
    post,
  ]);

  const handleCommentTextChange = useCallback(
    (text: string) => {
      // Allow typing but don't exceed character limit
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
      // Option 1: Try with orderBy (requires composite index)
      let commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId),
        orderBy(sortBy, "desc")
      );

      let querySnapshot;
      try {
        querySnapshot = await getDocs(commentsQuery);
      } catch (indexError) {
        // Option 2: Fallback without orderBy if index doesn't exist
        commentsQuery = query(
          collection(db, "comments"),
          where("postId", "==", postId)
        );
        querySnapshot = await getDocs(commentsQuery);
      }

      let fetchedComments: Comment[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));

      // Sort client-side if we couldn't sort server-side
      fetchedComments = fetchedComments.sort((a, b) => {
        if (sortBy === "createdAt") {
          const aTime = a.createdAt?.seconds
            ? a.createdAt.seconds
            : new Date(a.createdAt).getTime() / 1000;
          const bTime = b.createdAt?.seconds
            ? b.createdAt.seconds
            : new Date(b.createdAt).getTime() / 1000;
          return bTime - aTime;
        } else {
          // Sort by likeCount
          return b.likeCount - a.likeCount;
        }
      });

      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [postId, sortBy]);

  const toggleCommentLike = useCallback(
    async (commentId: string, currentlyLiked: boolean) => {
      if (!currentUser?.uid || likingComments.has(commentId)) return;

      // Add to loading state
      setLikingComments((prev) => new Set(prev).add(commentId));

      try {
        const commentRef = doc(db, "comments", commentId);

        // Find the current comment to check its current state
        const currentComment = comments.find((c) => c.id === commentId);
        if (!currentComment) return;

        const wasLiked =
          currentComment.likedBy?.includes(currentUser.uid) || false;
        const wasDisliked =
          currentComment.dislikedBy?.includes(currentUser.uid) || false;

        let updateData: any = {};

        if (currentlyLiked) {
          // Remove like
          updateData = {
            likeCount: increment(-1),
            likedBy: arrayRemove(currentUser.uid),
          };
        } else {
          // Add like
          updateData = {
            likeCount: increment(1),
            likedBy: arrayUnion(currentUser.uid),
          };

          // If user was previously disliking, remove dislike
          if (wasDisliked) {
            updateData.dislikeCount = increment(-1);
            updateData.dislikedBy = arrayRemove(currentUser.uid);
          }
        }

        await updateDoc(commentRef, updateData);

        // Update local state accurately
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: currentlyLiked
                    ? Math.max(0, comment.likeCount - 1)
                    : comment.likeCount + 1,
                  dislikeCount:
                    !currentlyLiked && wasDisliked
                      ? Math.max(0, comment.dislikeCount - 1)
                      : comment.dislikeCount,
                  likedBy: currentlyLiked
                    ? comment.likedBy?.filter(
                        (uid) => uid !== currentUser.uid
                      ) || []
                    : [...(comment.likedBy || []), currentUser.uid],
                  dislikedBy:
                    !currentlyLiked && wasDisliked
                      ? comment.dislikedBy?.filter(
                          (uid) => uid !== currentUser.uid
                        ) || []
                      : comment.dislikedBy || [],
                }
              : comment
          )
        );
      } catch (error) {
        console.error("Error toggling comment like:", error);
      } finally {
        // Remove from loading state
        setLikingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
    [currentUser?.uid, likingComments, comments]
  );

  const toggleCommentDislike = useCallback(
    async (commentId: string, currentlyDisliked: boolean) => {
      if (!currentUser?.uid || likingComments.has(commentId)) return;

      // Add to loading state
      setLikingComments((prev) => new Set(prev).add(commentId));

      try {
        const commentRef = doc(db, "comments", commentId);

        // Find the current comment to check its current state
        const currentComment = comments.find((c) => c.id === commentId);
        if (!currentComment) return;

        const wasLiked =
          currentComment.likedBy?.includes(currentUser.uid) || false;
        const wasDisliked =
          currentComment.dislikedBy?.includes(currentUser.uid) || false;

        let updateData: any = {};

        if (currentlyDisliked) {
          // Remove dislike
          updateData = {
            dislikeCount: increment(-1),
            dislikedBy: arrayRemove(currentUser.uid),
          };
        } else {
          // Add dislike
          updateData = {
            dislikeCount: increment(1),
            dislikedBy: arrayUnion(currentUser.uid),
          };

          // If user was previously liking, remove like
          if (wasLiked) {
            updateData.likeCount = increment(-1);
            updateData.likedBy = arrayRemove(currentUser.uid);
          }
        }

        await updateDoc(commentRef, updateData);

        // Update local state accurately
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  dislikeCount: currentlyDisliked
                    ? Math.max(0, comment.dislikeCount - 1)
                    : comment.dislikeCount + 1,
                  likeCount:
                    !currentlyDisliked && wasLiked
                      ? Math.max(0, comment.likeCount - 1)
                      : comment.likeCount,
                  dislikedBy: currentlyDisliked
                    ? comment.dislikedBy?.filter(
                        (uid) => uid !== currentUser.uid
                      ) || []
                    : [...(comment.dislikedBy || []), currentUser.uid],
                  likedBy:
                    !currentlyDisliked && wasLiked
                      ? comment.likedBy?.filter(
                          (uid) => uid !== currentUser.uid
                        ) || []
                      : comment.likedBy || [],
                }
              : comment
          )
        );
      } catch (error) {
        console.error("Error toggling comment dislike:", error);
      } finally {
        // Remove from loading state
        setLikingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
    [currentUser?.uid, likingComments, comments]
  );

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => {
      const isLiked = Boolean(item.likedBy?.includes(currentUser?.uid || ""));
      const isDisliked = Boolean(
        item.dislikedBy?.includes(currentUser?.uid || "")
      );
      const commentDate = formatDate(item.createdAt);
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
              {item.isAnonymous ? "Anonymous" : item.authorUsername}
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
                    {item.likeCount}
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
                    {item.dislikeCount}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [
      currentUser?.uid,
      isLight,
      formatDate,
      toggleCommentLike,
      toggleCommentDislike,
      likingComments,
    ]
  );

  // Fetch post and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch post and comments in parallel
      await Promise.all([fetchPost(), fetchComments()]);

      setLoading(false);
    };

    fetchData();
  }, [postId]);

  // Refetch comments when sort changes
  useEffect(() => {
    if (post) {
      // Only if post is already loaded
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

  const isLiked = post.likedBy?.includes(currentUser?.uid || "");
  const date = formatDate(post.createdAt);
  const displayUsername = post.isAnonymous ? "Anonymous" : post.username;

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
                      navigation.navigate("FullScreenImageViewer", { imageUrl })
                    }
                    style={styles.imageContainer}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.answerImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
                    {post.likeCount}
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
                    {post.likeCount}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

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
            Share your review about this answer:
          </Text>

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
                {sortBy === "createdAt" ? "Recency" : "Upvotes"}
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
                  if (sortBy !== "createdAt") setSortBy("createdAt");
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color: isLight ? "#000" : "#EEE",
                      fontWeight: sortBy === "createdAt" ? "700" : "500",
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
                  if (sortBy !== "likeCount") setSortBy("likeCount");
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color: isLight ? "#000" : "#EEE",
                      fontWeight: sortBy === "likeCount" ? "700" : "500",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 12,
    marginLeft: 4,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: "600",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  placeholder: {
    width: 56,
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
  // Comment section styles
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
  // Comments list styles
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
  // Sort dropdown styles (consistent with OthersAnswersListScreen)
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
