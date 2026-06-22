import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export type SubCatItem = {
  id: string;
  label: string;
  imageUri?: string;
};

interface SubCategoryNavProps {
  items: SubCatItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const SUB_NAV_WIDTH = 108;

export default function SubCategoryNav({ items, selectedId, onSelect }: SubCategoryNavProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((item) => {
          const active = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => onSelect(item.id)}
            >
              <View style={[styles.circle, active && styles.circleActive]}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Text style={styles.fallback}>{item.label.charAt(0).toUpperCase()}</Text>
                )}
              </View>
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={2}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const CIRCLE = 54;

const styles = StyleSheet.create({
  container: {
    width: SUB_NAV_WIDTH,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    paddingVertical: 8,
    paddingBottom: 180,
  },
  item: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleActive: {
    backgroundColor: '#F5EEFF',
    borderWidth: 2,
    borderColor: '#35035C',
  },
  image: {
    width: CIRCLE,
    height: CIRCLE,
  },
  fallback: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 14,
  },
  labelActive: {
    fontWeight: '800',
    color: '#35035C',
  },
});
