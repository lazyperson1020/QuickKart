import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  onBack: () => void;
  onSubmit: (text: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchHeader({
  value,
  onChangeText,
  onBack,
  onSubmit,
  autoFocus = false,
  placeholder = 'Search for products...',
}: SearchHeaderProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} hitSlop={8} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={() => onSubmit(value)}
          autoFocus={autoFocus}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#bbb" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    marginRight: 12,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    padding: 0,
  },
});
