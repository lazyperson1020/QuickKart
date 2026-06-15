import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import BottomSheet from './BottomSheet';

export interface FilterOptions {
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'discount';
  brands: string[];
  maxPrice: number | null;
  inStockOnly: boolean;
  offersOnly: boolean;
}

export const DEFAULT_FILTERS: FilterOptions = {
  sortBy: 'default',
  brands: [],
  maxPrice: null,
  inStockOnly: false,
  offersOnly: false,
};

interface ProductFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  availableBrands: string[];
  currentFilters: FilterOptions;
}

const SORT_OPTIONS: { label: string; value: FilterOptions['sortBy'] }[] = [
  { label: 'Relevance', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Discount', value: 'discount' },
];

export default function ProductFilterSheet({
  visible,
  onClose,
  onApply,
  availableBrands,
  currentFilters,
}: ProductFilterSheetProps) {
  const [local, setLocal] = useState<FilterOptions>(currentFilters);
  const [priceInput, setPriceInput] = useState(
    currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : ''
  );

  // Sync if parent resets filters
  useEffect(() => {
    setLocal(currentFilters);
    setPriceInput(currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : '');
  }, [currentFilters, visible]);

  const toggleBrand = (brand: string) => {
    setLocal((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleApply = () => {
    const maxPrice = priceInput.trim() ? Number(priceInput) : null;
    onApply({ ...local, maxPrice: isNaN(maxPrice as number) ? null : maxPrice });
    onClose();
  };

  const handleReset = () => {
    setLocal(DEFAULT_FILTERS);
    setPriceInput('');
  };

  const activeCount = [
    local.sortBy !== 'default',
    local.brands.length > 0,
    priceInput.trim() !== '',
    local.inStockOnly,
    local.offersOnly,
  ].filter(Boolean).length;

  return (
    <BottomSheet visible={visible} onClose={onClose} height={580}>
      {/* Sheet header */}
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filter & Sort</Text>
        {activeCount > 0 && (
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset ({activeCount})</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* SORT */}
        <Text style={styles.sectionLabel}>Sort By</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, local.sortBy === opt.value && styles.chipActive]}
              onPress={() => setLocal((p) => ({ ...p, sortBy: opt.value }))}
            >
              <Text style={[styles.chipText, local.sortBy === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BRAND */}
        {availableBrands.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Brand</Text>
            <View style={styles.chipRow}>
              {availableBrands.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={[styles.chip, local.brands.includes(brand) && styles.chipActive]}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      local.brands.includes(brand) && styles.chipTextActive,
                    ]}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* MAX PRICE */}
        <Text style={styles.sectionLabel}>Max Price (₹)</Text>
        <View style={styles.priceInputWrap}>
          <TextInput
            style={styles.priceInput}
            value={priceInput}
            onChangeText={setPriceInput}
            placeholder="e.g. 500"
            placeholderTextColor="#666"
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* TOGGLES */}
        <Text style={styles.sectionLabel}>More Filters</Text>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setLocal((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
        >
          <Text style={styles.toggleLabel}>In Stock Only</Text>
          <View style={[styles.toggle, local.inStockOnly && styles.toggleOn]}>
            <View style={[styles.toggleThumb, local.inStockOnly && styles.toggleThumbOn]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setLocal((p) => ({ ...p, offersOnly: !p.offersOnly }))}
        >
          <Text style={styles.toggleLabel}>Offers Only</Text>
          <View style={[styles.toggle, local.offersOnly && styles.toggleOn]}>
            <View style={[styles.toggleThumb, local.offersOnly && styles.toggleThumbOn]} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Apply button */}
      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={styles.applyBtnText}>Apply Filters</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  resetText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#aab0bb',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a4555',
    backgroundColor: '#1A2233',
  },
  chipActive: {
    borderColor: '#e91e63',
    backgroundColor: '#2a0d1a',
  },
  chipText: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#e91e63',
    fontWeight: '700',
  },
  priceInputWrap: {
    backgroundColor: '#1A2233',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3a4555',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  priceInput: {
    color: '#fff',
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2233',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 15,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3a4555',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: '#e91e63',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  applyBtn: {
    backgroundColor: '#e91e63',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
