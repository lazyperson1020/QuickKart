import React, { useMemo } from "react";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface CategoryRecyclerProps {
  selectedCategory: string;
  onSelectCategory: (categoryTitle: string) => void;
}

const categories = [
  { id: "1", icon: "🛒", title: "All" },
  { id: "2", icon: "🍎", title: "Fresh" },
  { id: "3", icon: "🥛", title: "Dairy" },
  { id: "4", icon: "🍪", title: "Snacks" },
  { id: "5", icon: "🥤", title: "Drinks" },
  { id: "6", icon: "🍫", title: "Chocolate" },
];

export default function CategoryRecycler({ selectedCategory, onSelectCategory }: CategoryRecyclerProps) {
  
  const dataProvider = useMemo(() => {
    return new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(categories);
  }, []);

  const layoutProvider = useMemo(() => {
    return new LayoutProvider(
      () => "CATEGORY",
      (type, dim) => {
        dim.width = 90;
        dim.height = 95;
      }
    );
  }, []);

  // 1. Notice how we destructure the internal `extendedState` from the list engine parameters here
  const rowRenderer = (type: string | number, item: any, index: number, extendedState: any) => {
    // 2. Use the forced state to safely determine selection matches
    const isActive = extendedState?.currentSelected === item.title;

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => onSelectCategory(item.title)}
        style={styles.itemWrapper}
      >
        <Text style={{ fontSize: 30 }}>{item.icon}</Text>
        <Text style={[styles.title, isActive && styles.activeTitle]}>
          {item.title}
        </Text>
        
        {/* The Bottom Black Selection Bar */}
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ height: 105 }}>
      <RecyclerListView
        isHorizontal
        showsHorizontalScrollIndicator={false}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        
        // 3. THIS IS THE FIX: Passing global dependencies down into the row recycler layout
        extendedState={{ currentSelected: selectedCategory }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: 'relative'
  },
  title: {
    marginTop: 6,
    fontWeight: "500",
    color: "#555",
  },
  activeTitle: {
    fontWeight: "700",
    color: "#000",
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 50,          
    height: 3,           
    backgroundColor: '#000000', 
    borderRadius: 2,
  }
});