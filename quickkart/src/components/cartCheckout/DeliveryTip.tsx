import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../localization/LanguageContext';

interface Props {
  selectedTip: number;
  onSelectTip: (tip: number) => void;
}

const tips = [10, 20, 50];

export default function DeliveryTip({ selectedTip, onSelectTip }: Props) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header Container */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: '#FFF0F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Ionicons name="heart" size={18} color="#e91e63" />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>
              {t.deliveryTip.tipDeliveryPartner}
            </Text>
            <Text style={{ color: '#999', fontSize: 12, marginTop: 1 }}>
              {t.deliveryTip.subtitle}
            </Text>
          </View>
        </View>

        {/* Clear Option Button */}
        {selectedTip > 0 && (
          <TouchableOpacity onPress={() => onSelectTip(0)} activeOpacity={0.7}>
            <Text style={{ color: '#e91e63', fontSize: 13, fontWeight: '700' }}>{t.deliveryTip.clear}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tip Selectors */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {tips.map(tip => {
          const selected = selectedTip === tip;
          return (
            <TouchableOpacity
              key={tip}
              onPress={() => onSelectTip(tip)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: selected ? '#e91e63' : '#E0E0E0',
                backgroundColor: selected ? '#FFF0F6' : '#FAFAFA',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: selected ? '#e91e63' : '#555',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                ₹{tip}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}