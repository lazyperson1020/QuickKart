// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   TextInput,
// } from 'react-native';
// import BottomSheet from './BottomSheet';

// export interface FilterOptions {
//   sortBy: 'default' | 'price_asc' | 'price_desc' | 'discount';
//   brands: string[];
//   maxPrice: number | null;
//   inStockOnly: boolean;
//   offersOnly: boolean;
// }

// export const DEFAULT_FILTERS: FilterOptions = {
//   sortBy: 'default',
//   brands: [],
//   maxPrice: null,
//   inStockOnly: false,
//   offersOnly: false,
// };

// interface ProductFilterSheetProps {
//   visible: boolean;
//   onClose: () => void;
//   onApply: (filters: FilterOptions) => void;
//   availableBrands: string[];
//   currentFilters: FilterOptions;
// }

// type FilterTab = 'brand' | 'price' | 'more';

// export default function ProductFilterSheet({
//   visible,
//   onClose,
//   onApply,
//   availableBrands,
//   currentFilters,
// }: ProductFilterSheetProps) {
//   const [local, setLocal] = useState<FilterOptions>(currentFilters);
//   const [activeTab, setActiveTab] = useState<FilterTab>('brand');
//   const [priceInput, setPriceInput] = useState(
//     currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : ''
//   );

//   useEffect(() => {
//     setLocal(currentFilters);
//     setPriceInput(currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : '');
//   }, [currentFilters, visible]);

//   const toggleBrand = (brand: string) => {
//     setLocal((prev) => ({
//       ...prev,
//       brands: prev.brands.includes(brand)
//         ? prev.brands.filter((b) => b !== brand)
//         : [...prev.brands, brand],
//     }));
//   };

//   const handleApply = () => {
//     const maxPrice = priceInput.trim() ? Number(priceInput) : null;
//     onApply({ ...local, maxPrice: isNaN(maxPrice as number) ? null : maxPrice });
//     onClose();
//   };

//   const handleReset = () => {
//     setLocal(DEFAULT_FILTERS);
//     setPriceInput('');
//   };

//   // Dynamically renders the right side-panel depending on the highlighted tab
//   const renderRightPaneContent = () => {
//     switch (activeTab) {
//       case 'brand':
//         return (
//           <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.paneContent}>
//             {availableBrands.map((brand) => {
//               const isSelected = local.brands.includes(brand);
//               return (
//                 <TouchableOpacity
//                   key={brand}
//                   style={styles.filterRow}
//                   onPress={() => toggleBrand(brand)}
//                 >
//                   <Text style={[styles.filterItemText, isSelected && styles.filterItemTextActive]}>
//                     {brand}
//                   </Text>
//                   <View style={[styles.checkbox, isSelected && styles.checkboxChecked]} />
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         );

//       case 'price':
//         return (
//           <View style={styles.paneContent}>
//             <Text style={styles.paneSectionHeading}>Select price range</Text>
//             <View style={styles.priceInputWrap}>
//               <Text style={styles.currencySymbol}>₹</Text>
//               <TextInput
//                 style={styles.priceInput}
//                 value={priceInput}
//                 onChangeText={setPriceInput}
//                 placeholder="Maximum Price"
//                 placeholderTextColor="#999"
//                 keyboardType="numeric"
//                 returnKeyType="done"
//               />
//             </View>
//           </View>
//         );

//       case 'more':
//         return (
//           <View style={styles.paneContent}>
//             <TouchableOpacity
//               style={styles.toggleRow}
//               onPress={() => setLocal((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
//             >
//               <Text style={styles.toggleLabel}>In Stock Only</Text>
//               <View style={[styles.toggle, local.inStockOnly && styles.toggleOn]}>
//                 <View style={[styles.toggleThumb, local.inStockOnly && styles.toggleThumbOn]} />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.toggleRow}
//               onPress={() => setLocal((p) => ({ ...p, offersOnly: !p.offersOnly }))}
//             >
//               <Text style={styles.toggleLabel}>Offers Only</Text>
//               <View style={[styles.toggle, local.offersOnly && styles.toggleOn]}>
//                 <View style={[styles.toggleThumb, local.offersOnly && styles.toggleThumbOn]} />
//               </View>
//             </TouchableOpacity>
//           </View>
//         );
//     }
//   };

//   return (
//     <BottomSheet visible={visible} onClose={onClose} height={600}>
//       {/* Title Header */}
//       <View style={styles.sheetHeader}>
//         <Text style={styles.sheetTitle}>Filters</Text>
//       </View>
//       <View style={styles.divider} />

//       {/* Main Split Layout container */}
//       <View style={styles.splitBodyWrapper}>
        
//         {/* Left Hand Navigation Menu Panel */}
//         <View style={styles.leftSidebar}>
//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'brand' && styles.activeTabButton]}
//             onPress={() => setActiveTab('brand')}
//           >
//             <Text style={[styles.tabText, activeTab === 'brand' && styles.activeTabText]}>
//               Brand
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'price' && styles.activeTabButton]}
//             onPress={() => setActiveTab('price')}
//           >
//             <Text style={[styles.tabText, activeTab === 'price' && styles.activeTabText]}>
//               Price
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'more' && styles.activeTabButton]}
//             onPress={() => setActiveTab('more')}
//           >
//             <Text style={[styles.tabText, activeTab === 'more' && styles.activeTabText]}>
//               More Filters
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Right Hand Context Items Panel */}
//         <View style={styles.rightContentPane}>
//           {renderRightPaneContent()}
//         </View>
//       </View>

//       {/* Persistent Bottom Action Footer Buttons */}
//       <View style={styles.footerActionContainer}>
//         <TouchableOpacity style={styles.clearAllBtn} onPress={handleReset}>
//           <Text style={styles.clearAllBtnText}>Clear all</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.showProductsBtn} onPress={handleApply}>
//           <Text style={styles.showProductsBtnText}>Show products</Text>
//         </TouchableOpacity>
//       </View>
//     </BottomSheet>
//   );
// }

// const styles = StyleSheet.create({
//   sheetHeader: {
//     paddingVertical: 4,
//     marginBottom: 12,
//   },
//   sheetTitle: {
//     color: '#111111',
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#F0F0F0',
//     marginHorizontal: -20, 
//   },

//   /* Split Layout Architectures */
//   splitBodyWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     marginHorizontal: -20, 
//   },
//   leftSidebar: {
//     flex: 0.38,
//     backgroundColor: '#FAFAFA',
//     borderRightWidth: 1,
//     borderColor: '#EEEEEE',
//   },
//   rightContentPane: {
//     flex: 0.62,
//     backgroundColor: '#FFFFFF',
//   },
//   paneContent: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },

//   /* Tab Buttons styling */
//   tabButton: {
//     paddingVertical: 18,
//     paddingHorizontal: 16,
//     backgroundColor: '#FAFAFA',
//   },
//   activeTabButton: {
//     backgroundColor: '#FFF2F6', 
//     borderLeftWidth: 4,
//     borderLeftColor: '#E91E63',
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#444444',
//   },
//   activeTabText: {
//     color: '#E91E63',
//     fontWeight: '700',
//   },

//   /* Row Items styling inside lists */
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#FDFDFD',
//   },
//   filterItemText: {
//     fontSize: 14,
//     color: '#333333',
//     fontWeight: '400',
//   },
//   filterItemTextActive: {
//     color: '#000000',
//     fontWeight: '600',
//   },
//   checkbox: {
//     width: 18,
//     height: 18,
//     borderRadius: 4,
//     borderWidth: 1.5,
//     borderColor: '#CCCCCC',
//   },
//   checkboxChecked: {
//     backgroundColor: '#E91E63',
//     borderColor: '#E91E63',
//   },

//   /* Price Input styling variations */
//   paneSectionHeading: {
//     fontSize: 14,
//     color: '#555555',
//     marginBottom: 12,
//     fontWeight: '500',
//   },
//   priceInputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DDDDDD',
//     paddingHorizontal: 12,
//   },
//   currencySymbol: {
//     fontSize: 16,
//     color: '#333333',
//     marginRight: 6,
//     fontWeight: '600',
//   },
//   priceInput: {
//     flex: 1,
//     color: '#111111',
//     fontSize: 15,
//     paddingVertical: 10,
//   },

//   /* Toggle Switches styling layout modifications */
//   toggleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F5F5F5',
//   },
//   toggleLabel: {
//     color: '#333333',
//     fontSize: 15,
//   },
//   toggle: {
//     width: 44,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     paddingHorizontal: 2,
//   },
//   toggleOn: {
//     backgroundColor: '#E91E63',
//   },
//   toggleThumb: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.5,
//   },
//   toggleThumbOn: {
//     alignSelf: 'flex-end',
//   },

//   /* Persistent Layout Footer Call-to-Actions container panel styling */
//   footerActionContainer: {
//     flexDirection: 'row',
//     paddingTop: 12,
//     paddingBottom: 4,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: -20,
//     paddingHorizontal: 20,
//   },
//   clearAllBtn: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     marginRight: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#DDDDDD',
//   },
//   clearAllBtnText: {
//     color: '#E91E63',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   showProductsBtn: {
//     flex: 1.3,
//     backgroundColor: '#E91E63',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 10,
//   },
//   showProductsBtnText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     fontSize: 15,
//   },
// });
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PanResponder,
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
  totalProductsCount?: number; // Optional prop to dynamically show filtered item count in button
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
  const [local, setLocal] = useState<FilterOptions>(currentFilters);
  const [activeTab, setActiveTab] = useState<FilterTab>('brand');
  const [priceInput, setPriceInput] = useState(
    currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : ''
  );

  useEffect(() => {
    setLocal(currentFilters);
    setPriceInput(currentFilters.maxPrice != null ? String(currentFilters.maxPrice) : '');
  }, [currentFilters, visible]);

  // Derived state to display the selection dot metrics on side tabs
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
            <Text style={styles.paneSectionHeading}>Select max price</Text>
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
          </View>
        );
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={600}>
      {/* Title Header */}
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filters</Text>
      </View>
      <View style={styles.divider} />

      {/* Main Split Layout container */}
      <View style={styles.splitBodyWrapper}>
        
        {/* Left Hand Navigation Menu Panel */}
        <View style={styles.leftSidebar}>
          
          {/* Brand Tab Component */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'brand' && styles.activeTabButton]}
            onPress={() => setActiveTab('brand')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'brand' && styles.activeTabText]}>
                Brand
              </Text>
              {isBrandActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>

          {/* Price Tab Component */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'price' && styles.activeTabButton]}
            onPress={() => setActiveTab('price')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'price' && styles.activeTabText]}>
                Price
              </Text>
              {isPriceActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>

          {/* More Filters Tab Component */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'more' && styles.activeTabButton]}
            onPress={() => setActiveTab('more')}
          >
            <View style={styles.tabContentRow}>
              <Text style={[styles.tabText, activeTab === 'more' && styles.activeTabText]}>
                More Filters
              </Text>
              {isMoreActive && <View style={styles.activeDotIndicator} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Hand Context Items Panel */}
        <View style={styles.rightContentPane}>
          {renderRightPaneContent()}
        </View>
      </View>

      {/* Persistent Bottom Action Footer Buttons */}
      <View style={styles.footerActionContainer}>
        <TouchableOpacity style={styles.clearAllBtn} onPress={handleReset}>
          <Text style={styles.clearAllBtnText}>Clear all</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.showProductsBtn} onPress={handleApply}>
          <Text style={styles.showProductsBtnText}>
            {totalProductsCount !== undefined 
              ? `Show ${totalProductsCount} products` 
              : 'Show products'}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const MAX_PRICE = 1000;

function PriceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef(0);
  const trackPageXRef = useRef(0);
  const [trackW, setTrackW] = useState(0);

  const progress = trackW > 0 ? Math.max(0, Math.min(value, MAX_PRICE)) / MAX_PRICE : 0;

  const valueFromAbsX = (absX: number) => {
    const rel = Math.max(0, Math.min(absX - trackPageXRef.current, trackWidthRef.current));
    return Math.round((rel / trackWidthRef.current) * MAX_PRICE);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_e, gs) => {
        if (trackWidthRef.current > 0) onChange(valueFromAbsX(gs.x0));
      },
      onPanResponderMove: (_e, gs) => {
        if (trackWidthRef.current > 0) onChange(valueFromAbsX(gs.moveX));
      },
    })
  ).current;

  const thumbPos = progress * trackW;

  return (
    <View style={{ paddingTop: 16, paddingBottom: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#E91E63', textAlign: 'center', marginBottom: 24 }}>
        ₹{value || 0}
      </Text>

      <View
        ref={trackRef}
        style={{ height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginHorizontal: 8 }}
        onLayout={() => {
          trackRef.current?.measure((_x, _y, w, _h, pageX) => {
            trackWidthRef.current = w;
            trackPageXRef.current = pageX;
            setTrackW(w);
          });
        }}
        {...panResponder.panHandlers}
      >
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: thumbPos, backgroundColor: '#E91E63', borderRadius: 2 }} />
        <View style={{
          position: 'absolute', top: -10, left: thumbPos - 12,
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: '#E91E63',
          elevation: 4,
          shadowColor: '#E91E63', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4,
        }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 8, marginTop: 14 }}>
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

  /* Split Layout Architectures */
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

  /* Tab Buttons & Row Layout Indicators */
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

  /* Row Items styling inside lists */
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

  /* Price Input styling variations */
  paneSectionHeading: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 12,
    fontWeight: '500',
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333333',
    marginRight: 6,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    color: '#111111',
    fontSize: 15,
    paddingVertical: 10,
  },

  /* Toggle Switches styling layout modifications */
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

  /* Persistent Layout Footer Call-to-Actions container panel styling */
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