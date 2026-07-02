import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import BottomSheet from './BottomSheet';
import { useTranslation } from '../localization/LanguageContext';

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
  totalProductsCount?: number;
}

type FilterTab = 'brand' | 'price' | 'more';

export default function ProductFilterSheet({
  visible,
  onClose,
  onApply,
  availableBrands,
  currentFilters,
  totalProductsCount,
}: ProductFilterSheetProps) {
  const { t } = useTranslation();
  const [local, setLocal] = useState<FilterOptions>(currentFilters);
  const [activeTab, setActiveTab] = useState<FilterTab>('brand');
  const [priceInput, setPriceInput] = useState(
    currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : ''
  );

  useEffect(() => {
    setLocal(currentFilters);
    setPriceInput(currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : '');
  }, [currentFilters, visible]);

  const isBrandActive = local.brands.length > 0;
  const isPriceActive = priceInput.trim() !== '';
  const isMoreActive = local.inStockOnly || local.offersOnly;

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

  const renderRightPaneContent = () => {
    switch (activeTab) {
      case 'brand':
        return (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.paneContent}>
            {availableBrands.map((brand) => {
              const isSelected = local.brands.includes(brand);
              return (
                <TouchableOpacity
                  key={brand}
                  style={styles.filterRow}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text style={[styles.filterItemText, isSelected && styles.filterItemTextActive]}>
                    {brand}
                  </Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'price':
        return (
          <View style={styles.paneContent}>
            <Text style={styles.paneSectionHeading}>{t.productFilterSheet.selectMaxPrice}</Text>
            <PriceSlider
              value={priceInput ? Number(priceInput) : 0}
              onChange={(v) => setPriceInput(v > 0 ? String(v) : '')}
            />
          </View>
        );

      case 'more':
        return (
          <View style={styles.paneContent}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setLocal((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
            >
              <Text style={styles.toggleLabel}>{t.productFilterSheet.inStockOnly}</Text>
              <View style={[styles.toggle, local.inStockOnly && styles.toggleOn]}>
                <View style={[styles.toggleThumb, local.inStockOnly && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setLocal((p) => ({ ...p, offersOnly: !p.offersOnly }))}
            >
              <Text style={styles.toggleLabel}>{t.productFilterSheet.offersOnly}</Text>
              <View style={[styles.toggle, local.offersOnly && styles.toggleOn]}>
                <View style={[styles.toggleThumb, local.offersOnly && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={600}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{t.productFilterSheet.filters}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.splitBodyWrapper}>
        <View style={styles.leftSidebar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'brand' && styles.activeTabButton]}
            onPress={() => setActiveTab('brand')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'brand' && styles.activeTabText]}>
                {t.categoryDetail.brand}
              </Text>
              {isBrandActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'price' && styles.activeTabButton]}
            onPress={() => setActiveTab('price')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'price' && styles.activeTabText]}>
                {t.searchResults.priceChipLabel}
              </Text>
              {isPriceActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'more' && styles.activeTabButton]}
            onPress={() => setActiveTab('more')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'more' && styles.activeTabText]}>
                {t.productFilterSheet.moreFilters}
              </Text>
              {isMoreActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rightContentPane}>
          {renderRightPaneContent()}
        </View>
      </View>

      <View style={styles.footerActionContainer}>
        <TouchableOpacity style={styles.clearAllBtn} onPress={handleReset}>
          <Text style={styles.clearAllBtnText}>{t.productFilterSheet.clearAll}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.showProductsBtn} onPress={handleApply}>
          <Text style={styles.showProductsBtnText}>
            {totalProductsCount !== undefined
              ? t.productFilterSheet.showProductsCount(totalProductsCount)
              : t.productFilterSheet.showProducts}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const MAX_PRICE = 1000;

function PriceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackWidthRef = useRef(0);
  const isDragging = useRef(false);
  const lastPriceRef = useRef(value);
  const sliderPositionX = useSharedValue(0);
  const [displayPrice, setDisplayPrice] = useState(value);

  // Sync from parent only when not actively dragging (e.g. on reset)
  useEffect(() => {
    if (!isDragging.current && trackWidthRef.current > 0) {
      sliderPositionX.value = (Math.max(0, Math.min(value, MAX_PRICE)) / MAX_PRICE) * trackWidthRef.current;
      setDisplayPrice(value);
    }
  }, [value]);

  const handleMove = (locationX: number) => {
    const tw = trackWidthRef.current;
    if (tw === 0) return;
    isDragging.current = true;
    // subtract 12 to offset the 12px left margin on the track
    const x = Math.max(0, Math.min(locationX - 12, tw));
    sliderPositionX.value = x;
    const price = Math.round((x / tw) * MAX_PRICE);
    lastPriceRef.current = price;
    setDisplayPrice(price);
  };

  const handleRelease = () => {
    isDragging.current = false;
    onChange(lastPriceRef.current);
  };

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: sliderPositionX.value,
  }));

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderPositionX.value }],
  }));

  return (
    <View style={{ paddingTop: 16, paddingBottom: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#E91E63', textAlign: 'center', marginBottom: 24 }}>
        ₹{displayPrice || 0}
      </Text>

      <View
        style={{ height: 44, justifyContent: 'center' }}
        onLayout={(e) => {
          const tw = Math.max(0, e.nativeEvent.layout.width - 24);
          trackWidthRef.current = tw;
          if (!isDragging.current) {
            sliderPositionX.value = (Math.max(0, Math.min(value, MAX_PRICE)) / MAX_PRICE) * tw;
          }
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handleMove(e.nativeEvent.locationX)}
        onResponderMove={(e) => handleMove(e.nativeEvent.locationX)}
        onResponderRelease={handleRelease}
        onResponderTerminate={handleRelease}
      >
        <View style={{ height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginHorizontal: 12 }}>
          <Animated.View style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#E91E63', borderRadius: 2 }, animatedProgressStyle]} />
          <Animated.View style={[{
            position: 'absolute', top: -10, left: -12,
            width: 24, height: 24, borderRadius: 12,
            backgroundColor: '#E91E63',
            elevation: 4,
            shadowColor: '#E91E63', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4,
          }, animatedThumbStyle]} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12, marginTop: 4 }}>
        <Text style={{ fontSize: 11, color: '#999' }}>₹0</Text>
        <Text style={{ fontSize: 11, color: '#999' }}>₹{MAX_PRICE}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetHeader: {
    paddingVertical: 4,
    marginBottom: 12,
  },
  sheetTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: -20,
  },
  splitBodyWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: -20,
  },
  leftSidebar: {
    flex: 0.38,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderColor: '#EEEEEE',
  },
  rightContentPane: {
    flex: 0.62,
    backgroundColor: '#FFFFFF',
  },
  paneContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabButton: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  activeTabButton: {
    backgroundColor: '#FFF2F6',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
  },
  activeTabText: {
    color: '#E91E63',
    fontWeight: '700',
  },
  activeDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E91E63',
    marginLeft: 6,
    alignSelf: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDFDFD',
  },
  filterItemText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '400',
  },
  filterItemTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  paneSectionHeading: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 12,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  toggleLabel: {
    color: '#333333',
    fontSize: 15,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: '#E91E63',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  footerActionContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  clearAllBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginRight: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  clearAllBtnText: {
    color: '#E91E63',
    fontWeight: '600',
    fontSize: 15,
  },
  showProductsBtn: {
    flex: 1.3,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  showProductsBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
