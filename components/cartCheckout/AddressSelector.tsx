import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default function AddressSelector({
  addresses,
  selectedId,
  onSelect,
}: any) {
  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 20,
        }}
      >
        Select Address
      </Text>

      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth:
                selectedId === item.id
                  ? 2
                  : 1,
              borderColor:
                selectedId === item.id
                  ? '#e91e63'
                  : '#EEE',
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 16,
              }}
            >
              {item.label}
            </Text>

            <Text
              style={{
                marginTop: 4,
                color: '#666',
              }}
            >
              {item.address}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}