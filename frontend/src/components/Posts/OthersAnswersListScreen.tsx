import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { firestore as db } from '@/src/firebaseConfig';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/src/types/navigation';
import FullScreenLoader from '@/src/components/common/FullScreenLoader';

// Types
export type Post = {
  id: string;
  question: string;
  username: string;
  createdAt: { seconds: number } | { toDate: () => Date } | any;
  likeCount: number;
};

type Nav = StackNavigationProp<RootStackParamList, 'OthersAnswersList'>;

const PAGE_SIZE = 10;

export default function OthersAnswersListScreen() {
  const navigation = useNavigation<Nav>();
  const isLight = useSelector((s: RootState) => s.theme.isLight);
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  // cursorStack[N] is the cursor to startAfter for page N (0-based). cursorStack[0] = null for first page.
  const [cursorStack, setCursorStack] = useState<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'createdAt' | 'likeCount'>('createdAt');
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);

  const formatDate = useCallback((createdAt: Post['createdAt']) => {
    try {
      if (!createdAt) return '';
      if (typeof createdAt?.seconds === 'number') {
        return new Date(createdAt.seconds * 1000).toLocaleString();
      }
      if (typeof createdAt?.toDate === 'function') {
        return createdAt.toDate().toLocaleString();
      }
      return new Date(createdAt).toLocaleString();
    } catch {
      return '';
    }
  }, []);

  const baseQuery = useMemo(() => {
    return query(
      collection(db, 'posts'),
      orderBy(sortBy, 'desc'),
      limit(PAGE_SIZE)
    );
  }, [sortBy]);

  const fetchNext = useCallback(async () => {
    setLoading(true);
    try {
      // To move to the next page, we fetch pageIndex+1 using startAfter cursorStack[pageIndex+1] (which is last doc of current page)
      const nextCursor = cursorStack[pageIndex + 1];
      let q = query(
        collection(db, 'posts'),
        orderBy(sortBy, 'desc'),
        limit(PAGE_SIZE)
      );
      if (nextCursor) {
        q = query(
          collection(db, 'posts'),
          orderBy(sortBy, 'desc'),
          startAfter(nextCursor),
          limit(PAGE_SIZE)
        );
      }
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Post[];
      // If no docs, we are already at the last page. Do not advance; just disable Next.
      if (docs.length === 0) {
        setHasNext(false);
        return;
      }
      setPosts(docs);
      const newLast = snap.docs[snap.docs.length - 1] ?? null;
      setCursorStack((prev) => {
        const copy = [...prev];
        // Ensure cursorStack[pageIndex + 2] equals newLast (since we just fetched page pageIndex+1)
        copy[pageIndex + 2] = newLast;
        return copy;
      });
      setLastDoc(newLast);
      setPageIndex((idx) => idx + 1);
      // Peek to check if there is at least one more doc after this page to avoid empty-page navigation
      if (newLast) {
        const peek = await getDocs(
          query(
            collection(db, 'posts'),
            orderBy(sortBy, 'desc'),
            startAfter(newLast),
            limit(1)
          )
        );
        setHasNext(peek.docs.length > 0);
      } else {
        setHasNext(false);
      }
    } finally {
      setLoading(false);
    }
  }, [cursorStack, pageIndex, sortBy]);

  const fetchPrev = useCallback(async () => {
    if (pageIndex <= 0) return; // already at first page
    setLoading(true);
    try {
      // To move to the previous page (pageIndex - 1), fetch using startAfter cursorStack[pageIndex - 1]
      const backCursor = cursorStack[pageIndex - 1] ?? null;
      let q = query(
        collection(db, 'posts'),
        orderBy(sortBy, 'desc'),
        limit(PAGE_SIZE)
      );
      if (backCursor) {
        q = query(
          collection(db, 'posts'),
          orderBy(sortBy, 'desc'),
          startAfter(backCursor),
          limit(PAGE_SIZE)
        );
      }
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Post[];
      setPosts(docs);
      const newLast = snap.docs[snap.docs.length - 1] ?? null;
      setLastDoc(newLast);
      setPageIndex((idx) => Math.max(0, idx - 1));
      // Peek to check if there is at least one more doc after this page
      if (newLast) {
        const peek = await getDocs(
          query(
            collection(db, 'posts'),
            orderBy(sortBy, 'desc'),
            startAfter(newLast),
            limit(1)
          )
        );
        setHasNext(peek.docs.length > 0);
      } else {
        setHasNext(false);
      }
    } finally {
      setLoading(false);
    }
  }, [cursorStack, pageIndex, sortBy]);

  useEffect(() => {
    // Reset pagination on sort change
    const init = async () => {
      setCursorStack([null]);
      setLastDoc(null);
      setHasNext(true);
      setPageIndex(0);
      // Load first page explicitly (pageIndex 0 uses cursorStack[0] = null)
      setLoading(true);
      try {
        const q = query(
          collection(db, 'posts'),
          orderBy(sortBy, 'desc'),
          limit(PAGE_SIZE)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Post[];
        setPosts(docs);
        const newLast = snap.docs[snap.docs.length - 1] ?? null;
        setLastDoc(newLast);
        setCursorStack([null, newLast]);
        // Peek for hasNext
        if (newLast) {
          const peek = await getDocs(
            query(
              collection(db, 'posts'),
              orderBy(sortBy, 'desc'),
              startAfter(newLast),
              limit(1)
            )
          );
          setHasNext(peek.docs.length > 0);
        } else {
          setHasNext(false);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [sortBy]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      const date = formatDate(item.createdAt);
      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isLight ? '#393E46' : '#FFFFFF',
              shadowColor: isLight ? '#FFF' : '#000',
            },
          ]}
          onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.question, { color: !isLight ? '#000' : '#EEE' }]}
            numberOfLines={2}
          >
            {item.question}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[styles.metaText, { color: !isLight ? '#555' : '#DDD' }]}
            >
              {item.username}
            </Text>
            <View style={styles.rightMetaRow}>
              <Text
                style={[styles.metaText, { color: !isLight ? '#555' : '#DDD' }]}
              >
                {date}
              </Text>
              <View style={styles.likeRow}>
                <Text
                  style={[
                    styles.likeCountNum,
                    { color: !isLight ? '#555' : '#666' },
                  ]}
                  numberOfLines={1}
                >
                  {item.likeCount ?? 0}
                </Text>
                <Text
                  style={[
                    styles.heart,
                    {
                      color:
                        item.likeCount > 0
                          ? '#FF3B30'
                          : !isLight
                          ? '#888'
                          : '#999',
                    },
                  ]}
                >
                  {item.likeCount > 0 ? '♥' : '♡'}
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
        { backgroundColor: !isLight ? '#F0F0F0' : '#222831' },
      ]}
    >
      {/* Header with sort toggle */}
      <View style={styles.header}>
        <Text
          style={[styles.headerLabel, { color: !isLight ? '#000' : '#EEE' }]}
        >
          Sort by:
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            { backgroundColor: !isLight ? '#FFF' : '#393E46' },
          ]}
          onPress={() => setSortMenuOpen(true)}
        >
          <Text style={{ color: !isLight ? '#000' : '#EEE' }}>
            {sortBy === 'createdAt' ? 'Recency' : 'Likes'}
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
              { backgroundColor: isLight ? '#FFFFFF' : '#2C2C2C' },
            ]}
            // stop propagation to avoid closing when tapping inside
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortMenuOpen(false);
                // keep as is if already selected
                if (sortBy !== 'createdAt') setSortBy('createdAt');
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: isLight ? '#000' : '#EEE',
                    fontWeight: sortBy === 'createdAt' ? '700' : '500',
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
                if (sortBy !== 'likeCount') setSortBy('likeCount');
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: isLight ? '#000' : '#EEE',
                    fontWeight: sortBy === 'likeCount' ? '700' : '500',
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first one to share your answer!
            </Text>
          </View>
        }
      />
      {/* Full-screen loader overlay for consistency */}
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

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
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
    alignItems: 'center',
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
    fontWeight: '600',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
  },
  rightMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  heart: {
    fontSize: 14,
    marginRight: 4,
  },
  likeCountNum: {
    width: 28,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  navButton: {
    backgroundColor: '#00ADB5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#666',
    fontWeight: '600',
  },
  // Sort dropdown styles
  sortOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sortCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    paddingVertical: 8,
    // shadow/elevation
    shadowColor: '#000',
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
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#888',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#AAA',
  },
});
