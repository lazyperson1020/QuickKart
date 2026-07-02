import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from '../../localization/LanguageContext';

interface Address { id: string; label: string; address: string; }

interface Props {
  addresses: Address[];
  selectedId?: string;
  onSelect: (addr: Address) => void;
  onClose: () => void;
  onAddNew: () => void;
  onDelete?: (id: string) => void;
}

const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  home: 'home-outline',
  work: 'business-outline',
  other: 'location-outline',
};

function getIcon(label: string): React.ComponentProps<typeof Ionicons>['name'] {
  const key = label.toLowerCase();
  return ICON_MAP[key] ?? 'location-outline';
}

export default function AddressSelector({ addresses, selectedId, onSelect, onClose, onAddNew, onDelete }: Props) {
  const { t } = useTranslation();
  const confirmDelete = (id: string) => {
    Alert.alert(t.addressSelector.deleteAddressTitle, t.addressSelector.deleteAddressMessage, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.addressSelector.delete, style: 'destructive', onPress: () => onDelete?.(id) },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.addressSelector.selectAddress}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={10}>
          <AntDesign name="close" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Add New Address */}
      <TouchableOpacity style={styles.addBtn} onPress={onAddNew} activeOpacity={0.7}>
        <View style={styles.addLeft}>
          <AntDesign name="plus" size={18} color="#e91e63" />
          <Text style={styles.addText}>{t.addressSelector.addNewAddress}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#888" />
      </TouchableOpacity>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>{t.addressSelector.savedAddresses}</Text>
          <FlatList
            data={addresses}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedId === item.id;
              return (
                <View style={[styles.card, isSelected && styles.cardSelected]}>
                  <TouchableOpacity
                    onPress={() => onSelect(item)}
                    activeOpacity={0.8}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
                  >
                    <View style={styles.iconCircle}>
                      <Ionicons name={getIcon(item.label)} size={20} color="#555" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.labelRow}>
                        <Text style={styles.cardLabel}>{item.label}</Text>
                        {isSelected && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{t.addressSelector.selected}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
                    </View>
                  </TouchableOpacity>
                  {onDelete && (
                    <TouchableOpacity onPress={() => confirmDelete(item.id)} hitSlop={8} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={18} color="#FF3269" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  addLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e91e63',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 14,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderColor: '#e91e63',
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2e7d32',
  },
  cardAddress: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  deleteBtn: {
    paddingLeft: 8,
    paddingTop: 2,
    justifyContent: 'center',
  },
});
