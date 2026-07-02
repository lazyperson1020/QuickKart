import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolate, SharedValue } from "react-native-reanimated";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; 

interface CategoryRecyclerProps {
  selectedCategory: string;
  onSelectCategory: (categoryTitle: string) => void;
  scrollY: SharedValue<number>;
}

interface CategoryItem {
  id: string;
  type: string;
  name: string;
  title: string;
  color?: string;
  iconUrl?: string; 
}

// Local fallbacks matching your initial setup
const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "1", type: "material", name: "apps", title: "All", color: "#552A86" },
  { id: "2", type: "fa6", name: "apple-whole", title: "Fresh", color: "#E12222" },
  { id: "3", type: "material", name: "bottle-tonic-plus-outline", title: "Dairy", color: "#1E88E5" },
  { id: "4", type: "material", name: "cookie-outline", title: "Snacks", color: "#D97706" },
  { id: "5", type: "material", name: "cup-water", title: "Drinks", color: "#06B6D4" },
  { id: "6", type: "material", name: "candy-outline", title: "Chocolate", color: "#B45309" },
];

const COLLAPSE_THRESHOLD = 70;

export default function CategoryRecycler({ 
  selectedCategory, 
  onSelectCategory, 
  scrollY 
}: CategoryRecyclerProps) {

  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categoryPriority"),
      (snap) => {
        if (!snap.empty) {
          const fetchedItems = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: doc.id,
              type: data.iconType || "material",
              name: data.iconName || "basket",
              color: data.iconColor || "#35035C",
              iconUrl: data.iconUrl || null,
              recyclerPriority: data.recyclerPriority ?? 99
            };
          });
          fetchedItems.sort((a, b) => a.recyclerPriority - b.recyclerPriority);
          setCategories([
            { id: "All", type: "material", name: "apps", title: "All" },
            ...fetchedItems
          ]);
        }
      },
      (err) => {
        console.warn("Failed to fetch custom dynamic navigation positions:", err);
      }
    );
    return unsubscribe;
  }, []);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [95, 46], Extrapolate.CLAMP);
    return { height };
  });

  return (
    <Animated.View style={[styles.track, animatedTrackStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((item) => {
          const isActive = selectedCategory === item.title;

          const animatedIconStyle = useAnimatedStyle(() => {
            const opacity = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD * 0.5], [1, 0], Extrapolate.CLAMP);
            const scale = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [1, 0], Extrapolate.CLAMP);
            const height = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [36, 0], Extrapolate.CLAMP);
            const marginBottom = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [4, 0], Extrapolate.CLAMP);
            
            return { opacity, transform: [{ scale }], height, marginBottom };
          });

          const animatedItemStyle = useAnimatedStyle(() => {
            const paddingTop = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [8, 12], Extrapolate.CLAMP);
            const paddingBottom = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [8, 12], Extrapolate.CLAMP);
            
            return { paddingTop, paddingBottom };
          });

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(item.title)}
              style={styles.touchTarget}
            >
              <Animated.View style={[styles.itemWrapper, animatedItemStyle]}>
                
                {/* Dynamic Graphics View Frame */}
                <Animated.View style={[animatedIconStyle, styles.iconCentered]}>
                  <View style={[styles.iconBubble, { backgroundColor: isActive ? '#F5EEFF' : '#F3F4F6' }]}>
                    
                    {/* CONDITIONALLY RENDER IMAGE OR FALLBACK TO VECTOR ICON */}
                    {item.iconUrl ? (
                      <Image 
                        source={{ uri: item.iconUrl }} 
                        style={styles.categoryImage} 
                        resizeMode="contain" 
                      />
                    ) : item.type === "material" ? (
                      <MaterialCommunityIcons 
                        name={item.name as any} 
                        size={22} 
                        color={isActive ? "#35035C" : "#4B5563"} 
                      />
                    ) : (
                      <FontAwesome6 
                        name={item.name} 
                        size={18} 
                        color={isActive ? "#35035C" : "#4B5563"} 
                      />
                    )}

                  </View>
                </Animated.View>

                <Text style={[styles.title, isActive && styles.activeTitle]}>
                  {item.title}
                </Text>

                {isActive && <View style={styles.activeIndicator} />}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#fff",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    overflow: "hidden",
  },
  scrollContainer: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  touchTarget: {
    width: 78,
    height: "100%",
  },
  itemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensures custom images fit inside the bubble frame perfectly
  },
  categoryImage: {
    width: 26, // Sized perfectly to rest cleanly inside your 38px bubble frame
    height: 26,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    letterSpacing: -0.1,
  },
  activeTitle: {
    fontWeight: "800",
    color: "#35035C", 
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: "#35035C",
    borderRadius: 2,
  },
});