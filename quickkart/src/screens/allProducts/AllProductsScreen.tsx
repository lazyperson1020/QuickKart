import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingCartPanel from '../../components/FloatingCartPanel';

// ── Image map (resolved at build time via require) ─────────────────────────────

const IMG = {
  fruitsandvegetables:  require('../../../assets/allCategoriesImages/fruitsandvegetables.png'),
  dairybreadandeggs:    require('../../../assets/allCategoriesImages/dairybreadandeggs.png'),
  attaandrice:          require('../../../assets/allCategoriesImages/attaandrice.png'),
  meatfishandeggs:      require('../../../assets/allCategoriesImages/meatfishandeggs.png'),
  masalaanddryfruits:   require('../../../assets/allCategoriesImages/masalaanddryfruits.png'),
  breakfastandsauces:   require('../../../assets/allCategoriesImages/breakfastandsauces.png'),
  packagedfoods:        require('../../../assets/allCategoriesImages/packagedfoods.png'),
  teacoffeeandmore:     require('../../../assets/allCategoriesImages/teacoffeeandmore.png'),
  icecreamsandmore:     require('../../../assets/allCategoriesImages/icecreamsandmore.png'),
  frozenfood:           require('../../../assets/allCategoriesImages/frozenfood.png'),
  sweetcravings:        require('../../../assets/allCategoriesImages/sweetcravings.png'),
  colddrinksandjuices:  require('../../../assets/allCategoriesImages/colddrinksandjuices.png'),
  munchies:             require('../../../assets/allCategoriesImages/munchies.png'),
  biscuitsandcookies:   require('../../../assets/allCategoriesImages/biscuitsandcookies.png'),
  apparel:              require('../../../assets/allCategoriesImages/apparel.png'),
  jewellery:            require('../../../assets/allCategoriesImages/jewellery.png'),
  personalcare:         require('../../../assets/allCategoriesImages/personalcare.png'),
  skincare:             require('../../../assets/allCategoriesImages/skincare.png'),
  makeupandbeauty:      require('../../../assets/allCategoriesImages/makeupandbeauty.png'),
  fragrance:            require('../../../assets/allCategoriesImages/fragrance.png'),
  bathandbody:          require('../../../assets/allCategoriesImages/bathandbody.png'),
  haircare:             require('../../../assets/allCategoriesImages/haircare.png'),
  babycare:             require('../../../assets/allCategoriesImages/babycare.png'),
  proteinandnutrition:  require('../../../assets/allCategoriesImages/proteinandnutrition.png'),
  pharmacyandwellness:  require('../../../assets/allCategoriesImages/pharmacyandwellness.png'),
  femininehygiene:      require('../../../assets/allCategoriesImages/femininehygiene.png'),
  sexualwellness:       require('../../../assets/allCategoriesImages/sexualwellness.png'),
  // Household Essentials
  homeneeds:            require('../../../assets/allCategoriesImages/homeneeds.png'),
  kitchenanddining:     require('../../../assets/allCategoriesImages/kitchenanddining.png'),
  cleaningessentials:   require('../../../assets/allCategoriesImages/cleaningessentials.png'),
  electronicsstore:     require('../../../assets/allCategoriesImages/electronicsstore.png'),
  petcare:              require('../../../assets/allCategoriesImages/petcare.png'),
  toysandsports:        require('../../../assets/allCategoriesImages/toysandsports.png'),
  stationeryandbooks:   require('../../../assets/allCategoriesImages/stationeryandbooks.png'),
  paancorner:           require('../../../assets/allCategoriesImages/paancorner.png'),
  // Shop by Store
  giftstore:            require('../../../assets/allCategoriesImages/giftstore.png'),
  ayushstore:           require('../../../assets/allCategoriesImages/ayushstore.png'),
  poojastore:           require('../../../assets/allCategoriesImages/poojastore.png'),
  dermastore:           require('../../../assets/allCategoriesImages/dermastore.png'),
  globalstore:          require('../../../assets/allCategoriesImages/globalstore.png'),
  sportsstore:          require('../../../assets/allCategoriesImages/sportsstore.png'),
  gaminggiftcards:      require('../../../assets/allCategoriesImages/gaminggiftcards.png'),
  babystore:            require('../../../assets/allCategoriesImages/babystore.png'),
  pleasurestore:        require('../../../assets/allCategoriesImages/pleasurestore.png'),
  automotivestore:      require('../../../assets/allCategoriesImages/automotivestore.png'),
};

// ── Types ──────────────────────────────────────────────────────────────────────

type CategoryItem = {
  id: string;
  label: string;
  emoji: string;
  image?: any;
  bgColor: string;
  firebaseCategory?: string;
  searchQuery?: string;
  isNew?: boolean;
};

type CategoryGroup = {
  numCols: 2 | 3 | 4;
  items: CategoryItem[];
};

type CategorySection = {
  id: string;
  title: string;
  groups: CategoryGroup[];
};

// ── Data ───────────────────────────────────────────────────────────────────────

const SECTIONS: CategorySection[] = [
  {
    id: 'grocery',
    title: 'Grocery & Kitchen',
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'fv',   label: 'Fruits &\nVegetables', emoji: '🥦', image: IMG.fruitsandvegetables, bgColor: '#E8F5E9', firebaseCategory: 'Fresh',  searchQuery: 'Fresh' },
          { id: 'dbe',  label: 'Dairy, Bread\n& Eggs',  emoji: '🥛', image: IMG.dairybreadandeggs,   bgColor: '#E3F2FD', firebaseCategory: 'Dairy',  searchQuery: 'Dairy' },
          { id: 'arod', label: 'Atta, Rice,\nOil & Dals', emoji: '🌾', image: IMG.attaandrice,       bgColor: '#FFF8E1', searchQuery: 'Atta' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'mfe', label: 'Meat, Fish\n& Eggs',  emoji: '🍖', image: IMG.meatfishandeggs,    bgColor: '#FCE4EC', searchQuery: 'Meat' },
          { id: 'mdf', label: 'Masala &\nDry Fruits', emoji: '🌶️', image: IMG.masalaanddryfruits, bgColor: '#FFF3E0', searchQuery: 'Masala' },
          { id: 'bs',  label: 'Breakfast\n& Sauces',  emoji: '🥣', image: IMG.breakfastandsauces, bgColor: '#F3E5F5', searchQuery: 'Breakfast' },
          { id: 'pkf', label: 'Packaged\nFood',        emoji: '📦', image: IMG.packagedfoods,      bgColor: '#E0F7FA', searchQuery: 'Packaged' },
        ],
      },
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks & Drinks',
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'tcm', label: 'Tea, Coffee\n& More', emoji: '☕', image: IMG.teacoffeeandmore,    bgColor: '#FFF8E1', searchQuery: 'Tea' },
          { id: 'icm', label: 'Ice Creams\n& More',  emoji: '🍦', image: IMG.icecreamsandmore,    bgColor: '#F3E5F5', searchQuery: 'Ice Cream' },
          { id: 'ff',  label: 'Frozen\nFood',         emoji: '🧊', image: IMG.frozenfood,          bgColor: '#E3F2FD', searchQuery: 'Frozen' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'sc',  label: 'Sweet\nCravings',       emoji: '🍬', image: IMG.sweetcravings,       bgColor: '#FCE4EC', searchQuery: 'Sweet' },
          { id: 'cdj', label: 'Cold Drinks\n& Juices', emoji: '🥤', image: IMG.colddrinksandjuices, bgColor: '#E8F5E9', searchQuery: 'Drinks' },
          { id: 'mu',  label: 'Munchies',               emoji: '🍿', image: IMG.munchies,            bgColor: '#FFF3E0', searchQuery: 'Munchies' },
          { id: 'bc',  label: 'Biscuits\n& Cookies',    emoji: '🍪', image: IMG.biscuitsandcookies,  bgColor: '#E0F7FA', searchQuery: 'Biscuits' },
        ],
      },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion & Lifestyle',
    groups: [
      {
        numCols: 2,
        items: [
          { id: 'app', label: 'Apparel',   emoji: '👗', image: IMG.apparel,   bgColor: '#F3E5F5', searchQuery: 'Apparel' },
          { id: 'jew', label: 'Jewellery', emoji: '💍', image: IMG.jewellery, bgColor: '#FFF8E1', searchQuery: 'Jewellery' },
        ],
      },
    ],
  },
  {
    id: 'beauty',
    title: 'Beauty & Personal Care',
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'pcs',  label: 'Personal Care\nStudio', emoji: '💄', image: IMG.personalcare,      bgColor: '#FCE4EC', searchQuery: 'Personal Care' },
          { id: 'skin', label: 'Skincare',               emoji: '🧴', image: IMG.skincare,           bgColor: '#E3F2FD', searchQuery: 'Skincare' },
          { id: 'mab',  label: 'Makeup\n& Beauty',       emoji: '💅', image: IMG.makeupandbeauty,   bgColor: '#F3E5F5', searchQuery: 'Makeup' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'frag',     label: 'Fragrance',    emoji: '🌸', image: IMG.fragrance,          bgColor: '#FFF8E1', searchQuery: 'Fragrance' },
          { id: 'bb',       label: 'Bath &\nBody', emoji: '🛁', image: IMG.bathandbody,         bgColor: '#E8F5E9', searchQuery: 'Bath' },
          { id: 'hair',     label: 'Haircare',     emoji: '💇', image: IMG.haircare,            bgColor: '#FFF3E0', searchQuery: 'Haircare' },
          { id: 'babycare', label: 'Baby Care',    emoji: '👶', image: IMG.babycare,            bgColor: '#E0F7FA', searchQuery: 'Baby Care' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'pn', label: 'Protein &\nNutrition', emoji: '💪', image: IMG.proteinandnutrition, bgColor: '#E8F5E9', searchQuery: 'Protein' },
          { id: 'pw', label: 'Pharmacy\n& Wellness', emoji: '💊', image: IMG.pharmacyandwellness,  bgColor: '#E3F2FD', searchQuery: 'Pharmacy' },
          { id: 'fh', label: 'Feminine\nHygiene',    emoji: '🌺', image: IMG.femininehygiene,      bgColor: '#FCE4EC', searchQuery: 'Feminine' },
          { id: 'sw', label: 'Sexual\nWellness',     emoji: '💜', image: IMG.sexualwellness,        bgColor: '#F3E5F5', searchQuery: 'Sexual Wellness' },
        ],
      },
    ],
  },
  {
    id: 'household',
    title: 'Household Essentials',
    groups: [
      {
        numCols: 4,
        items: [
          { id: 'hn',  label: 'Home\nNeeds',         emoji: '🏠', image: IMG.homeneeds,          bgColor: '#E8F5E9', searchQuery: 'Home',        },
          { id: 'kd',  label: 'Kitchen\n& Dining',   emoji: '🍳', image: IMG.kitchenanddining,   bgColor: '#FFF8E1', searchQuery: 'Kitchen',     },
          { id: 'ce',  label: 'Cleaning\nEssentials', emoji: '🧹', image: IMG.cleaningessentials, bgColor: '#E3F2FD', searchQuery: 'Cleaning' },
          { id: 'es',  label: 'Electronics\nStore',  emoji: '📱', image: IMG.electronicsstore,   bgColor: '#F3E5F5', firebaseCategory: 'Electronics', searchQuery: 'Electronics' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'pc',  label: 'Pet Care',            emoji: '🐾', image: IMG.petcare,            bgColor: '#FFF3E0', searchQuery: 'Pet' },
          { id: 'ts',  label: 'Toys &\nSports',      emoji: '🎮', image: IMG.toysandsports,      bgColor: '#FCE4EC', searchQuery: 'Toys' },
          { id: 'sb',  label: 'Stationery\n& Books', emoji: '📚', image: IMG.stationeryandbooks,  bgColor: '#E0F7FA', searchQuery: 'Stationery' },
          { id: 'pan', label: 'Paan\nCorner',         emoji: '🌿', image: IMG.paancorner,          bgColor: '#E8F5E9', searchQuery: 'Paan' },
        ],
      },
    ],
  },
  {
    id: 'stores',
    title: 'Shop by Store',
    groups: [
      {
        numCols: 4,
        items: [
          { id: 'gift',   label: 'Gift\nStore',   emoji: '🎁', image: IMG.giftstore,   bgColor: '#FCE4EC', searchQuery: 'Gift' },
          { id: 'ayush',  label: 'Ayush\nStore',  emoji: '🌿', image: IMG.ayushstore,  bgColor: '#E8F5E9', searchQuery: 'Ayush' },
          { id: 'pooja',  label: 'Pooja\nStore',  emoji: '🪔', image: IMG.poojastore,  bgColor: '#FFF8E1', searchQuery: 'Pooja' },
          { id: 'derma',  label: 'Derma\nStore',  emoji: '🧬', image: IMG.dermastore,  bgColor: '#E3F2FD', searchQuery: 'Derma' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'global',    label: 'Global\nStore',      emoji: '🌍', image: IMG.globalstore,     bgColor: '#E0F7FA', searchQuery: 'Global' },
          { id: 'sports',    label: 'Sports\nStore',      emoji: '⚽', image: IMG.sportsstore,     bgColor: '#FFF3E0', searchQuery: 'Sports' },
          { id: 'gaming',    label: 'Gaming\nGift Cards', emoji: '🎮', image: IMG.gaminggiftcards, bgColor: '#F3E5F5', searchQuery: 'Gaming' },
          { id: 'babystore', label: 'Baby\nStore',        emoji: '🍼', image: IMG.babystore,       bgColor: '#E0F7FA', searchQuery: 'Baby' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'pleasure', label: 'Pleasure\nStore',   emoji: '✨', image: IMG.pleasurestore,   bgColor: '#FCE4EC', searchQuery: 'Pleasure' },
          { id: 'auto',     label: 'Automotive\nStore', emoji: '🚗', image: IMG.automotivestore, bgColor: '#E8F5E9', searchQuery: 'Automotive' },
        ],
      },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function AllCategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const HORIZONTAL_PADDING = 10;
  const TILE_GAP = 8;

  const handleCategoryPress = useCallback(
    (item: CategoryItem) => {
      if (item.firebaseCategory) {
        navigation.navigate('CategoryDetail', { category: item.firebaseCategory, categoryTitle: item.label.replace('\n', ' ') });
      } else if (item.searchQuery) {
        navigation.navigate('SearchResults', { query: item.searchQuery });
      }
    },
    [router]
  );

  const totalW = width - HORIZONTAL_PADDING * 2;

  const renderTile = (item: CategoryItem, tileW: number, tileH: number) => {
    const isSmall = tileW < 110;
    const emojiFontSize = tileW > 160 ? 48 : tileW > 110 ? 34 : 24;

    return (
      <TouchableOpacity
        key={item.id}
        style={{ width: tileW, alignItems: 'center', marginBottom: 2 }}
        activeOpacity={0.78}
        onPress={() => handleCategoryPress(item)}
      >
        <View style={[styles.imageBox, { width: tileW, height: tileH }]}>
          {item.image ? (
            <Image
              source={item.image}
              style={{ width: tileW * 0.92, height: tileH * 0.92 }}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ fontSize: emojiFontSize }}>{item.emoji}</Text>
          )}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.tileLabel, isSmall && styles.tileLabelSmall]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGroup = (group: CategoryGroup, groupIndex: number) => {
    if (group.numCols === 3) {
      // Featured-first: first tile is 2× wide, two smaller tiles beside it
      // Divide total into 4 units: [2] [1] [1]
      const unit = (totalW - TILE_GAP * 2) / 4;
      const featW = unit * 2;
      const smallW = unit;
      const tileH = smallW; // all tiles same height; small tiles are square
      return (
        <View key={groupIndex} style={[styles.group, { gap: TILE_GAP }]}>
          {renderTile(group.items[0], featW, tileH)}
          {group.items.slice(1).map(item => renderTile(item, smallW, tileH))}
        </View>
      );
    }

    if (group.numCols === 2) {
      // Two equal landscape tiles
      const tileW = (totalW - TILE_GAP) / 2;
      const tileH = tileW * 0.58;
      return (
        <View key={groupIndex} style={[styles.group, { gap: TILE_GAP }]}>
          {group.items.map(item => renderTile(item, tileW, tileH))}
        </View>
      );
    }

    // 4 columns: all equal, square
    const tileW = (totalW - TILE_GAP * 3) / 4;
    return (
      <View key={groupIndex} style={[styles.group, { gap: TILE_GAP }]}>
        {group.items.map(item => renderTile(item, tileW, tileW))}
      </View>
    );
  };

  const renderSection = (section: CategorySection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.groups.map((group, i) => renderGroup(group, i))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={{ width: 56 }} />
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Wishlist')}>
            <Ionicons name="heart-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} style={{ marginLeft: 16 }} onPress={() => navigation.navigate('SearchResults')}>
            <Ionicons name="search-outline" size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}>
        {SECTIONS.map(renderSection)}
      </ScrollView>

      <FloatingCartPanel />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111', textAlign: 'center' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', width: 56, justifyContent: 'flex-end' },
  scrollContent: { paddingTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginHorizontal: 14, marginBottom: 10, marginTop: 12 },
  group: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, gap: 8, marginBottom: 8 },
  tile: { alignItems: 'center', marginBottom: 2 },
  imageBox: {
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  newBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: '#35035C', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  newBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  tileLabel: { fontSize: 12, fontWeight: '500', color: '#111', textAlign: 'center', marginTop: 7, lineHeight: 17 },
  tileLabelSmall: { fontSize: 11, lineHeight: 15 },
});
