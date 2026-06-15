import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import SearchHeader from '../../../components/SearchHeader';
import { GroceryProduct } from '../../../components/productCard';

const RECENT_KEY = 'qk_recent_searches';
const MAX_RECENT = 8;
const CATEGORIES = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];

export default function SearchDiscoveryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<GroceryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const stored = await SecureStore.getItemAsync(RECENT_KEY);
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch {}
    };
    loadRecent();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoadingProducts(true);
      try {
        const items: GroceryProduct[] = [];
        for (const cat of CATEGORIES) {
          const snap = await getDocs(
            collection(db, 'products', cat, `${cat}Collection`)
          );
          snap.forEach((doc) =>
            items.push({ id: doc.id, ...doc.data(), category: cat } as GroceryProduct)
          );
        }
        setAllProducts(items);
      } catch {}
      setLoadingProducts(false);
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const seen = new Set<string>();
    const results: string[] = [];
    for (const p of allProducts) {
      if (results.length >= 8) break;
      if (p.name?.toLowerCase().includes(q) && !seen.has(p.name)) {
        seen.add(p.name);
        results.push(p.name);
      }
    }
    // Also surface matching brands/categories as suggestions
    for (const p of allProducts) {
      if (results.length >= 8) break;
      if (p.brand && p.brand.toLowerCase().includes(q) && !seen.has(p.brand)) {
        seen.add(p.brand);
        results.push(p.brand);
      }
    }
    setSuggestions(results);
  }, [query, allProducts]);

  const saveAndNavigate = useCallback(
    async (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      const updated = [trimmed, ...recentSearches.filter((r) => r !== trimmed)].slice(
        0,
        MAX_RECENT
      );
      setRecentSearches(updated);
      try {
        await SecureStore.setItemAsync(RECENT_KEY, JSON.stringify(updated));
      } catch {}
      router.push({
        pathname: '/(tabs)/search/results',
        params: { query: trimmed },
      });
    },
    [recentSearches, router]
  );

  const clearRecent = async () => {
    setRecentSearches([]);
    try {
      await SecureStore.deleteItemAsync(RECENT_KEY);
    } catch {}
  };

  const removeRecentItem = async (term: string) => {
    const updated = recentSearches.filter((r) => r !== term);
    setRecentSearches(updated);
    try {
      await SecureStore.setItemAsync(RECENT_KEY, JSON.stringify(updated));
    } catch {}
  };

  const showSuggestions = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        value={query}
        onChangeText={setQuery}
        onBack={() => router.back()}
        onSubmit={saveAndNavigate}
        autoFocus
        placeholder="Search for milk, fruits..."
      />

      {showSuggestions ? (
        /* ── Live Suggestions ── */
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionRow} onPress={() => saveAndNavigate(item)}>
              <Ionicons name="search-outline" size={17} color="#888" style={styles.rowIcon} />
              <Text style={styles.suggestionText}>{item}</Text>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => setQuery(item)}
                style={styles.fillIcon}
              >
                <Ionicons name="arrow-up-outline" size={16} color="#bbb" style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loadingProducts ? (
              <ActivityIndicator color="#2e7d32" style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No suggestions for "{query}"</Text>
                <TouchableOpacity
                  style={styles.searchAnyway}
                  onPress={() => saveAndNavigate(query)}
                >
                  <Text style={styles.searchAnywayText}>Search anyway →</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      ) : (
        /* ── Recent Searches ── */
        <View style={styles.recentSection}>
          {recentSearches.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecent} hitSlop={8}>
                  <Text style={styles.clearAll}>Clear all</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term) => (
                <View key={term} style={styles.recentRow}>
                  <TouchableOpacity
                    style={styles.recentLeft}
                    onPress={() => saveAndNavigate(term)}
                  >
                    <Ionicons name="time-outline" size={17} color="#888" style={styles.rowIcon} />
                    <Text style={styles.recentText}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity hitSlop={8} onPress={() => removeRecentItem(term)}>
                    <Ionicons name="close" size={16} color="#bbb" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={40} color="#ddd" />
              <Text style={styles.emptyText}>Start typing to search products</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowIcon: {
    marginRight: 14,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  fillIcon: {
    padding: 4,
  },
  recentSection: {
    flex: 1,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAll: {
    fontSize: 13,
    color: '#e91e63',
    fontWeight: '600',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  recentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentText: {
    fontSize: 15,
    color: '#333',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
  },
  searchAnyway: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  searchAnywayText: {
    color: '#e91e63',
    fontWeight: '600',
    fontSize: 14,
  },
});
