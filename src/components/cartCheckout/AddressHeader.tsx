import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../localization/LanguageContext';
interface Props {
  title?: string;
  address?: string;
  onPress?: () => void;
}

export default function AddressHeader({ title, address, onPress }: Props) {
  const { t } = useTranslation();
  const displayTitle = title ?? t.addressHeader.defaultTitle;
  const displayAddress = address ?? t.addressHeader.defaultAddress;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 10,
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: '#F5F0FF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name="location" size={20} color="#35035C" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: '#888', fontSize: 11, fontWeight: '500' }}>{t.addressHeader.deliveringTo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{displayTitle}</Text>
          <Ionicons name="chevron-down" size={14} color="#555" style={{ marginLeft: 4 }} />
        </View>
        <Text numberOfLines={1} style={{ color: '#999', fontSize: 12, marginTop: 2 }}>
          {displayAddress}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#E8F5E9',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#2e7d32', fontSize: 11, fontWeight: '700' }}>{t.addressHeader.etaMinutes}</Text>
      </View>
    </TouchableOpacity>
  );
}
