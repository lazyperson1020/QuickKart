import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../localization/LanguageContext';
import type { TranslationSchema } from '../localization/strings';

// ── Image map (resolved at build time via require) ─────────────────────────────

const IMG = {
  fruitsandvegetables:  require('../../assets/allCategoriesImages/fruitsandvegetables.png'),
  dairybreadandeggs:    require('../../assets/allCategoriesImages/dairybreadandeggs.png'),
  attaandrice:          require('../../assets/allCategoriesImages/attaandrice.png'),
  meatfishandeggs:      require('../../assets/allCategoriesImages/meatfishandeggs.png'),
  masalaanddryfruits:   require('../../assets/allCategoriesImages/masalaanddryfruits.png'),
  breakfastandsauces:   require('../../assets/allCategoriesImages/breakfastandsauces.png'),
  packagedfoods:        require('../../assets/allCategoriesImages/packagedfoods.png'),
  teacoffeeandmore:     require('../../assets/allCategoriesImages/teacoffeeandmore.png'),
  icecreamsandmore:     require('../../assets/allCategoriesImages/icecreamsandmore.png'),
  frozenfood:           require('../../assets/allCategoriesImages/frozenfood.png'),
  sweetcravings:        require('../../assets/allCategoriesImages/sweetcravings.png'),
  colddrinksandjuices:  require('../../assets/allCategoriesImages/colddrinksandjuices.png'),
  munchies:             require('../../assets/allCategoriesImages/munchies.png'),
  biscuitsandcookies:   require('../../assets/allCategoriesImages/biscuitsandcookies.png'),
  apparel:              require('../../assets/allCategoriesImages/apparel.png'),
  jewellery:            require('../../assets/allCategoriesImages/jewellery.png'),
  personalcare:         require('../../assets/allCategoriesImages/personalcare.png'),
  skincare:             require('../../assets/allCategoriesImages/skincare.png'),
  makeupandbeauty:      require('../../assets/allCategoriesImages/makeupandbeauty.png'),
  fragrance:            require('../../assets/allCategoriesImages/fragrance.png'),
  bathandbody:          require('../../assets/allCategoriesImages/bathandbody.png'),
  haircare:             require('../../assets/allCategoriesImages/haircare.png'),
  babycare:             require('../../assets/allCategoriesImages/babycare.png'),
  proteinandnutrition:  require('../../assets/allCategoriesImages/proteinandnutrition.png'),
  pharmacyandwellness:  require('../../assets/allCategoriesImages/pharmacyandwellness.png'),
  femininehygiene:      require('../../assets/allCategoriesImages/femininehygiene.png'),
  // sexualwellness:       require('../../assets/allCategoriesImages/sexualwellness.png'),
  // Household Essentials
  homeneeds:            require('../../assets/allCategoriesImages/homeneeds.png'),
  kitchenanddining:     require('../../assets/allCategoriesImages/kitchenanddining.png'),
  cleaningessentials:   require('../../assets/allCategoriesImages/cleaningessentials.png'),
  electronicsstore:     require('../../assets/allCategoriesImages/electronicsstore.png'),
  petcare:              require('../../assets/allCategoriesImages/petcare.png'),
  toysandsports:        require('../../assets/allCategoriesImages/toysandsports.png'),
  stationeryandbooks:   require('../../assets/allCategoriesImages/stationeryandbooks.png'),
  paancorner:           require('../../assets/allCategoriesImages/paancorner.png'),
  // Shop by Store
  giftstore:            require('../../assets/allCategoriesImages/giftstore.png'),
  ayushstore:           require('../../assets/allCategoriesImages/ayushstore.png'),
  poojastore:           require('../../assets/allCategoriesImages/poojastore.png'),
  dermastore:           require('../../assets/allCategoriesImages/dermastore.png'),
  globalstore:          require('../../assets/allCategoriesImages/globalstore.png'),
  sportsstore:          require('../../assets/allCategoriesImages/sportsstore.png'),
  gaminggiftcards:      require('../../assets/allCategoriesImages/gaminggiftcards.png'),
  babystore:            require('../../assets/allCategoriesImages/babystore.png'),
  // pleasurestore:        require('../../assets/allCategoriesImages/pleasurestore.png'),
  automotivestore:      require('../../assets/allCategoriesImages/automotivestore.png'),
};

// ── Types ──────────────────────────────────────────────────────────────────────

type CategoryItem = {
  id: string;
  label: string;
  emoji: string;
  image?: any;
  bgColor: string;
  firebaseCategory?: string;
  subCategory?: string;
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

const buildSections = (t: TranslationSchema): CategorySection[] => [
  {
    id: 'grocery',
    title: t.allCategoriesGrid.sectionTitles.grocery,
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'fv',   label: t.allCategoriesGrid.tiles.fv,    emoji: '🥦', image: IMG.fruitsandvegetables, bgColor: '#E8F5E9', firebaseCategory: 'Fresh' },
          { id: 'dbe',  label: t.allCategoriesGrid.tiles.dbe,  emoji: '🥛', image: IMG.dairybreadandeggs,   bgColor: '#E3F2FD', firebaseCategory: 'Dairy' },
          { id: 'arod', label: t.allCategoriesGrid.tiles.arod, emoji: '🌾', image: IMG.attaandrice,       bgColor: '#FFF8E1', firebaseCategory: 'Grocery', subCategory: 'Atta & Rice' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'mfe', label: t.allCategoriesGrid.tiles.mfe,    emoji: '🍖', image: IMG.meatfishandeggs,    bgColor: '#FCE4EC', firebaseCategory: 'Grocery', subCategory: 'Meat & Fish' },
          { id: 'mdf', label: t.allCategoriesGrid.tiles.mdf,  emoji: '🌶️', image: IMG.masalaanddryfruits, bgColor: '#FFF3E0', firebaseCategory: 'Grocery', subCategory: 'Masala & Spices' },
          { id: 'bs',  label: t.allCategoriesGrid.tiles.bs,   emoji: '🥣', image: IMG.breakfastandsauces, bgColor: '#F3E5F5', firebaseCategory: 'Grocery', subCategory: 'Breakfast & Sauces' },
          { id: 'pkf', label: t.allCategoriesGrid.tiles.pkf,         emoji: '📦', image: IMG.packagedfoods,      bgColor: '#E0F7FA', firebaseCategory: 'Snacks',  subCategory: 'Noodles' },
        ],
      },
    ],
  },
  {
    id: 'snacks',
    title: t.allCategoriesGrid.sectionTitles.snacks,
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'tcm', label: t.allCategoriesGrid.tiles.tcm, emoji: '☕', image: IMG.teacoffeeandmore,    bgColor: '#FFF8E1', firebaseCategory: 'Snacks', subCategory: 'Tea,Coffee' },
          { id: 'icm', label: t.allCategoriesGrid.tiles.icm,  emoji: '🍦', image: IMG.icecreamsandmore,    bgColor: '#F3E5F5', firebaseCategory: 'Snacks', subCategory: 'Ice Cream' },
          { id: 'ff',  label: t.allCategoriesGrid.tiles.ff,         emoji: '🧊', image: IMG.frozenfood,          bgColor: '#E3F2FD', firebaseCategory: 'Snacks', subCategory: 'Frozen Food' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'sc',  label: t.allCategoriesGrid.tiles.sc,       emoji: '🍬', image: IMG.sweetcravings,       bgColor: '#FCE4EC', firebaseCategory: 'Snacks', subCategory: 'Sweet Cravings' },
          { id: 'cdj', label: t.allCategoriesGrid.tiles.cdj, emoji: '🥤', image: IMG.colddrinksandjuices, bgColor: '#E8F5E9', firebaseCategory: 'Drinks' },
          { id: 'mu',  label: t.allCategoriesGrid.tiles.mu,               emoji: '🍿', image: IMG.munchies,            bgColor: '#FFF3E0', firebaseCategory: 'Snacks' },
          { id: 'bc',  label: t.allCategoriesGrid.tiles.bc,    emoji: '🍪', image: IMG.biscuitsandcookies,  bgColor: '#E0F7FA', firebaseCategory: 'Snacks', subCategory: 'Biscuits' },
        ],
      },
    ],
  },
  {
    id: 'fashion',
    title: t.allCategoriesGrid.sectionTitles.fashion,
    groups: [
      {
        numCols: 2,
        items: [
          { id: 'app', label: t.allCategoriesGrid.tiles.app,   emoji: '👗', image: IMG.apparel,   bgColor: '#F3E5F5', firebaseCategory: 'Fashion', subCategory: 'Apparel' },
          { id: 'jew', label: t.allCategoriesGrid.tiles.jew, emoji: '💍', image: IMG.jewellery, bgColor: '#FFF8E1', firebaseCategory: 'Fashion', subCategory: 'Jewellery' },
        ],
      },
    ],
  },
  {
    id: 'beauty',
    title: t.allCategoriesGrid.sectionTitles.beauty,
    groups: [
      {
        numCols: 3,
        items: [
          { id: 'pcs',  label: t.allCategoriesGrid.tiles.pcs, emoji: '💄', image: IMG.personalcare,      bgColor: '#FCE4EC', firebaseCategory: 'Beauty', subCategory: 'Personal Care' },
          { id: 'skin', label: t.allCategoriesGrid.tiles.skin,               emoji: '🧴', image: IMG.skincare,           bgColor: '#E3F2FD', firebaseCategory: 'Beauty', subCategory: 'Skincare' },
          { id: 'mab',  label: t.allCategoriesGrid.tiles.mab,       emoji: '💅', image: IMG.makeupandbeauty,   bgColor: '#F3E5F5', firebaseCategory: 'Beauty', subCategory: 'Makeup & Beauty' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'frag',     label: t.allCategoriesGrid.tiles.frag,    emoji: '🌸', image: IMG.fragrance,          bgColor: '#FFF8E1', firebaseCategory: 'Beauty', subCategory: 'Fragrance' },
          { id: 'bb',       label: t.allCategoriesGrid.tiles.bb, emoji: '🛁', image: IMG.bathandbody,         bgColor: '#E8F5E9', firebaseCategory: 'Beauty', subCategory: 'Bath & Body' },
          { id: 'hair',     label: t.allCategoriesGrid.tiles.hair,     emoji: '💇', image: IMG.haircare,            bgColor: '#FFF3E0', firebaseCategory: 'Beauty', subCategory: 'Haircare' },
          { id: 'babycare', label: t.allCategoriesGrid.tiles.babycare,    emoji: '👶', image: IMG.babycare,            bgColor: '#E0F7FA', firebaseCategory: 'Health', subCategory: 'Baby Care' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'pn', label: t.allCategoriesGrid.tiles.pn, emoji: '💪', image: IMG.proteinandnutrition, bgColor: '#E8F5E9', firebaseCategory: 'Health', subCategory: 'Protein & Nutrition' },
          { id: 'pw', label: t.allCategoriesGrid.tiles.pw, emoji: '💊', image: IMG.pharmacyandwellness,  bgColor: '#E3F2FD', firebaseCategory: 'Health', subCategory: 'Pharmacy & Wellness' },
          { id: 'fh', label: t.allCategoriesGrid.tiles.fh,    emoji: '🌺', image: IMG.femininehygiene,      bgColor: '#FCE4EC', firebaseCategory: 'Health', subCategory: 'Feminine Hygiene' },
          // { id: 'sw', label: t.allCategoriesGrid.tiles.sw,     emoji: '💜', image: IMG.sexualwellness,        bgColor: '#F3E5F5', subCategory: 'Sexual Wellness' },
        ],
      },
    ],
  },
  {
    id: 'household',
    title: t.allCategoriesGrid.sectionTitles.household,
    groups: [
      {
        numCols: 4,
        items: [
          { id: 'hn',  label: t.allCategoriesGrid.tiles.hn,          emoji: '🏠', image: IMG.homeneeds,          bgColor: '#E8F5E9', firebaseCategory: 'Household', subCategory: 'Home Needs' },
          { id: 'kd',  label: t.allCategoriesGrid.tiles.kd,   emoji: '🍳', image: IMG.kitchenanddining,   bgColor: '#FFF8E1', firebaseCategory: 'Household', subCategory: 'Kitchen & Dining' },
          { id: 'ce',  label: t.allCategoriesGrid.tiles.ce, emoji: '🧹', image: IMG.cleaningessentials, bgColor: '#E3F2FD', firebaseCategory: 'Household', subCategory: 'Cleaning Essentials' },
          { id: 'es',  label: t.allCategoriesGrid.tiles.es,  emoji: '📱', image: IMG.electronicsstore,   bgColor: '#F3E5F5', firebaseCategory: 'Electronics' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'pc',  label: t.allCategoriesGrid.tiles.pc,            emoji: '🐾', image: IMG.petcare,            bgColor: '#FFF3E0', firebaseCategory: 'Household', subCategory: 'Pet Care' },
          { id: 'ts',  label: t.allCategoriesGrid.tiles.ts,      emoji: '🎮', image: IMG.toysandsports,      bgColor: '#FCE4EC', firebaseCategory: 'Household', subCategory: 'Toys & Sports' },
          { id: 'sb',  label: t.allCategoriesGrid.tiles.sb, emoji: '📚', image: IMG.stationeryandbooks,  bgColor: '#E0F7FA', firebaseCategory: 'Household', subCategory: 'Stationery & Books' },
          { id: 'pan', label: t.allCategoriesGrid.tiles.pan,         emoji: '🌿', image: IMG.paancorner,          bgColor: '#E8F5E9', firebaseCategory: 'Household', subCategory: 'Paan Corner' },
        ],
      },
    ],
  },
  {
    id: 'stores',
    title: t.allCategoriesGrid.sectionTitles.stores,
    groups: [
      {
        numCols: 4,
        items: [
          { id: 'gift',   label: t.allCategoriesGrid.tiles.gift,   emoji: '🎁', image: IMG.giftstore,   bgColor: '#FCE4EC', firebaseCategory: 'Stores', subCategory: 'Gift Store' },
          { id: 'ayush',  label: t.allCategoriesGrid.tiles.ayush,  emoji: '🌿', image: IMG.ayushstore,  bgColor: '#E8F5E9', firebaseCategory: 'Stores', subCategory: 'Ayush Store' },
          { id: 'pooja',  label: t.allCategoriesGrid.tiles.pooja,  emoji: '🪔', image: IMG.poojastore,  bgColor: '#FFF8E1', firebaseCategory: 'Stores', subCategory: 'Pooja Store' },
          { id: 'derma',  label: t.allCategoriesGrid.tiles.derma,  emoji: '🧬', image: IMG.dermastore,  bgColor: '#E3F2FD', firebaseCategory: 'Stores', subCategory: 'Derma Store' },
        ],
      },
      {
        numCols: 4,
        items: [
          { id: 'global',    label: t.allCategoriesGrid.tiles.global,      emoji: '🌍', image: IMG.globalstore,     bgColor: '#E0F7FA', firebaseCategory: 'Stores', subCategory: 'Global Store' },
          { id: 'sports',    label: t.allCategoriesGrid.tiles.sports,      emoji: '⚽', image: IMG.sportsstore,     bgColor: '#FFF3E0', firebaseCategory: 'Stores', subCategory: 'Sports Store' },
          { id: 'gaming',    label: t.allCategoriesGrid.tiles.gaming, emoji: '🎮', image: IMG.gaminggiftcards, bgColor: '#F3E5F5', firebaseCategory: 'Stores', subCategory: 'Gaming' },
          { id: 'babystore', label: t.allCategoriesGrid.tiles.babystore,        emoji: '🍼', image: IMG.babystore,       bgColor: '#E0F7FA', firebaseCategory: 'Stores', subCategory: 'Baby Store' },
        ],
      },
      {
        numCols: 4,
        items: [
          // { id: 'pleasure', label: t.allCategoriesGrid.tiles.pleasure,   emoji: '✨', image: IMG.pleasurestore,   bgColor: '#FCE4EC', subCategory: 'Pleasure' },
          { id: 'auto',     label: t.allCategoriesGrid.tiles.auto, emoji: '🚗', image: IMG.automotivestore, bgColor: '#E8F5E9', firebaseCategory: 'Stores', subCategory: 'Automotive Store' },
        ],
      },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function AllCategoriesGrid() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const SECTIONS = useMemo(() => buildSections(t), [t]);
  const HORIZONTAL_PADDING = 10;
  const TILE_GAP = 8;

  const handleCategoryPress = useCallback(
    (item: CategoryItem) => {
      if (item.firebaseCategory) {
        navigation.navigate('CategoryDetail', { category: item.firebaseCategory, categoryTitle: item.label.replace('\n', ' '), subCategory: item.subCategory });
      } else if (item.subCategory) {
        navigation.navigate('SearchResults', { subCategory: item.subCategory });
      }
    },
    [navigation]
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

  return <View>{SECTIONS.map(renderSection)}</View>;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
