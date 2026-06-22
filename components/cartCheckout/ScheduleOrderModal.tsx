import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, ScrollView,
  StyleSheet, StatusBar, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../BottomSheet';
import { CartItem } from '../../app/redux/cartSlice';

const PINK = '#FF3269';
const AMBER = '#E67E22';
const BG = '#EEEEF7';

interface TimeSlot {
  display: string;
  short: string;
  section: 'earliest' | 'afternoon' | 'evening';
}

const TODAY_SLOTS: TimeSlot[] = [
  { display: '6 - 7 AM', short: '6AM-7AM', section: 'earliest' },
  { display: '7 - 8 AM', short: '7AM-8AM', section: 'earliest' },
  { display: '8 - 9 AM', short: '8AM-9AM', section: 'earliest' },
  { display: '9 - 10 AM', short: '9AM-10AM', section: 'earliest' },
  { display: '10 - 11 AM', short: '10AM-11AM', section: 'earliest' },
  { display: '11 - 12 PM', short: '11AM-12PM', section: 'earliest' },
  { display: '12 - 1 PM', short: '12PM-1PM', section: 'afternoon' },
  { display: '1 - 2 PM', short: '1PM-2PM', section: 'afternoon' },
  { display: '2 - 3 PM', short: '2PM-3PM', section: 'afternoon' },
  { display: '3 - 4 PM', short: '3PM-4PM', section: 'afternoon' },
  { display: '4 - 5 PM', short: '4PM-5PM', section: 'afternoon' },
  { display: '5 - 6 PM', short: '5PM-6PM', section: 'afternoon' },
  { display: '6 - 7 PM', short: '6PM-7PM', section: 'evening' },
  { display: '7 - 8 PM', short: '7PM-8PM', section: 'evening' },
  { display: '8 - 9 PM', short: '8PM-9PM', section: 'evening' },
  { display: '9 - 10 PM', short: '9PM-10PM', section: 'evening' },
  { display: '10 - 11 PM', short: '10PM-11PM', section: 'evening' },
  { display: '11 PM - 12 AM', short: '11PM-12AM', section: 'evening' },
];

const TOMORROW_SLOTS: TimeSlot[] = [
  { display: '9 - 10 AM', short: '9AM-10AM', section: 'earliest' },
  { display: '10 - 11 AM', short: '10AM-11AM', section: 'earliest' },
  { display: '11 - 12 PM', short: '11AM-12PM', section: 'earliest' },
  { display: '12 - 1 PM', short: '12PM-1PM', section: 'afternoon' },
  { display: '1 - 2 PM', short: '1PM-2PM', section: 'afternoon' },
  { display: '2 - 3 PM', short: '2PM-3PM', section: 'afternoon' },
  { display: '3 - 4 PM', short: '3PM-4PM', section: 'afternoon' },
  { display: '4 - 5 PM', short: '4PM-5PM', section: 'afternoon' },
  { display: '5 - 6 PM', short: '5PM-6PM', section: 'afternoon' },
  { display: '6 - 7 PM', short: '6PM-7PM', section: 'evening' },
];

function getDateLabels() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    todayLabel: `${today.getDate()} ${months[today.getMonth()]}`,
    tomorrowLabel: `${tomorrow.getDate()} ${months[tomorrow.getMonth()]}`,
  };
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dateLabel: string, slotDisplay: string, slotShort: string) => void;
  cartItems: CartItem[];
}

export default function ScheduleOrderModal({ visible, onClose, onConfirm, cartItems }: Props) {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const [showViewItems, setShowViewItems] = useState(false);

  const { todayLabel, tomorrowLabel } = getDateLabels();
  const currentDateLabel = selectedDate === 'today' ? todayLabel : tomorrowLabel;
  const slots = selectedDate === 'today' ? TODAY_SLOTS : TOMORROW_SLOTS;

  const earliestSlots = slots.filter(s => s.section === 'earliest');
  const afternoonSlots = slots.filter(s => s.section === 'afternoon');
  const eveningSlots = slots.filter(s => s.section === 'evening');

  const handleDateChange = (date: 'today' | 'tomorrow') => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowMoreSlots(false);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    onConfirm(currentDateLabel, selectedSlot.display, selectedSlot.short);
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[SS.container, { paddingTop: top }]}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        {/* Header */}
        <View style={SS.header}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={SS.headerTitle}>Schedule your order</Text>
            <Text style={SS.headerSub}>1 shipment</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        >
          <View style={SS.card}>
            {/* Shipment row */}
            <View style={SS.shipmentRow}>
              <View style={SS.thumbStack}>
                {cartItems.slice(0, 2).map((item, i) => (
                  <Image
                    key={item.id}
                    source={{ uri: item.imageUrl }}
                    style={[SS.thumb, i > 0 && { marginLeft: -10 }]}
                  />
                ))}
              </View>
              <Text style={SS.shipmentLabel}>Shipment</Text>
              <View style={SS.shipmentBadge}>
                <Text style={SS.shipmentBadgeText}>1 of 1</Text>
              </View>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-up" size={20} color="#888" />
            </View>

            <View style={SS.itemsRow}>
              <Text style={SS.itemsCount}>{cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}</Text>
              <Text style={SS.separator}> | </Text>
              <TouchableOpacity onPress={() => setShowViewItems(true)}>
                <Text style={SS.viewItemsLink}>View items</Text>
              </TouchableOpacity>
            </View>

            {/* High demand banner */}
            <View style={SS.demandBanner}>
              <View style={SS.demandIconWrap}>
                <Ionicons name="flash" size={16} color="#5B00B5" />
              </View>
              <Text style={SS.demandText}>
                <Text style={{ fontWeight: '700' }}>High Demand!</Text>
                {' '}Instant delivery is temporarily unavailable. Schedule for later.
              </Text>
            </View>

            {/* Delivery type selector */}
            <View style={SS.deliveryTypeRow}>
              <View style={SS.instantBox}>
                <Text style={SS.instantTitle}>Instant Delivery</Text>
                <Text style={SS.instantSub}>Unavailable</Text>
                <View style={{ position: 'absolute', right: 10, top: 12 }}>
                  <Ionicons name="flash" size={18} color="#CCC" />
                </View>
              </View>
              <View style={SS.scheduleBox}>
                <View style={{ flex: 1 }}>
                  <Text style={SS.scheduleTitle}>Schedule Delivery</Text>
                  <Text style={SS.scheduleSub} numberOfLines={1}>
                    {selectedSlot
                      ? `${currentDateLabel}, ${selectedSlot.display}`
                      : 'Select a slot'}
                  </Text>
                </View>
                <Ionicons name="calendar" size={22} color={AMBER} />
              </View>
            </View>

            {/* Date tabs */}
            <View style={SS.dateTabs}>
              <TouchableOpacity
                style={[SS.dateTab, selectedDate === 'today' && SS.dateTabActive]}
                onPress={() => handleDateChange('today')}
                activeOpacity={0.8}
              >
                <Text style={[SS.dateTabTitle, selectedDate === 'today' && SS.dateTabTitleActive]}>
                  Today, {todayLabel}
                </Text>
                <Text style={[SS.dateTabSlots, selectedDate === 'today' && SS.dateTabSlotsActive]}>
                  {TODAY_SLOTS.length} Slots
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[SS.dateTab, selectedDate === 'tomorrow' && SS.dateTabActive]}
                onPress={() => handleDateChange('tomorrow')}
                activeOpacity={0.8}
              >
                <Text style={[SS.dateTabTitle, selectedDate === 'tomorrow' && SS.dateTabTitleActive]}>
                  Tomorrow, {tomorrowLabel}
                </Text>
                <Text style={[SS.dateTabSlots, selectedDate === 'tomorrow' && SS.dateTabSlotsActive]}>
                  {TOMORROW_SLOTS.length} Slots
                </Text>
              </TouchableOpacity>
            </View>

            {/* EARLIEST */}
            {earliestSlots.length > 0 && (
              <>
                <View style={SS.sectionHeader}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={SS.sectionLabel}>EARLIEST</Text>
                </View>
                <SlotGrid slots={earliestSlots} selected={selectedSlot} onSelect={setSelectedSlot} />
              </>
            )}

            {/* AFTERNOON */}
            {afternoonSlots.length > 0 && (
              <>
                <View style={SS.sectionHeader}>
                  <Ionicons name="cloudy-outline" size={14} color="#888" />
                  <Text style={SS.sectionLabel}>AFTERNOON</Text>
                </View>
                <SlotGrid slots={afternoonSlots} selected={selectedSlot} onSelect={setSelectedSlot} />
              </>
            )}

            {/* EVENING (expandable) */}
            {eveningSlots.length > 0 && showMoreSlots && (
              <>
                <View style={SS.sectionHeader}>
                  <Ionicons name="moon-outline" size={14} color="#888" />
                  <Text style={SS.sectionLabel}>EVENING</Text>
                </View>
                <SlotGrid slots={eveningSlots} selected={selectedSlot} onSelect={setSelectedSlot} />
              </>
            )}

            {eveningSlots.length > 0 && (
              <TouchableOpacity
                style={SS.moreSlots}
                onPress={() => setShowMoreSlots(v => !v)}
                activeOpacity={0.8}
              >
                <Text style={SS.moreSlotsText}>{showMoreSlots ? 'Less Slots' : 'More Slots'}</Text>
                <Ionicons
                  name={showMoreSlots ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={PINK}
                />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Bottom area */}
        <View style={[SS.bottomArea, { paddingBottom: bottom + 16 }]}>
          <View style={SS.cancelNote}>
            <Ionicons name="information-circle-outline" size={16} color="#1565C0" />
            <Text style={SS.cancelNoteText}>You can cancel up to 30 min prior to delivery time</Text>
          </View>
          <TouchableOpacity
            style={[SS.confirmBtn, !selectedSlot && SS.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!selectedSlot}
            activeOpacity={0.8}
          >
            <Text style={SS.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* View items bottom sheet */}
      <BottomSheet visible={showViewItems} onClose={() => setShowViewItems(false)} height={420}>
        <Text style={SS.sheetTitle}>Shipment 1 of 1</Text>
        <Text style={SS.sheetSub}>{cartItems.length} items</Text>
        <ScrollView style={{ marginTop: 14 }} showsVerticalScrollIndicator={false}>
          {cartItems.map(item => (
            <View key={item.id} style={SS.sheetItemRow}>
              <Image source={{ uri: item.imageUrl }} style={SS.sheetItemImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={SS.sheetItemName}>{item.name}</Text>
                <Text style={SS.sheetItemQty}>
                  {item.weight} X {item.quantity} piece(s)
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </Modal>
  );
}

function SlotGrid({
  slots,
  selected,
  onSelect,
}: {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (s: TimeSlot) => void;
}) {
  const rows: TimeSlot[][] = [];
  for (let i = 0; i < slots.length; i += 3) {
    rows.push(slots.slice(i, i + 3));
  }
  return (
    <View style={SS.slotGrid}>
      {rows.map((row, ri) => (
        <View key={ri} style={SS.slotRow}>
          {row.map(slot => {
            const active = selected?.short === slot.short;
            return (
              <TouchableOpacity
                key={slot.short}
                style={[SS.slotBtn, active && SS.slotBtnActive]}
                onPress={() => onSelect(slot)}
                activeOpacity={0.8}
              >
                <Text style={[SS.slotBtnText, active && SS.slotBtnTextActive]}>
                  {slot.display}
                </Text>
              </TouchableOpacity>
            );
          })}
          {row.length < 3 &&
            Array(3 - row.length)
              .fill(null)
              .map((_, i) => <View key={`gap-${i}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}

const SS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  headerSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  shipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  thumbStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  thumb: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  shipmentLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginRight: 6,
  },
  shipmentBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  shipmentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemsCount: {
    fontSize: 13,
    color: '#888',
  },
  separator: {
    fontSize: 13,
    color: '#CCC',
  },
  viewItemsLink: {
    fontSize: 13,
    fontWeight: '700',
    color: PINK,
  },
  demandBanner: {
    backgroundColor: '#EEEEFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  demandIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D8C0FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  demandText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  deliveryTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  instantBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    minHeight: 64,
    position: 'relative',
  },
  instantTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AAA',
  },
  instantSub: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 3,
  },
  scheduleBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: AMBER,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF4',
    gap: 6,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  scheduleSub: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },
  dateTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  dateTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  dateTabActive: {
    borderBottomColor: PINK,
  },
  dateTabTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  dateTabTitleActive: {
    color: PINK,
  },
  dateTabSlots: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 2,
  },
  dateTabSlotsActive: {
    color: PINK,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
  },
  slotGrid: {
    gap: 10,
    marginBottom: 14,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 10,
  },
  slotBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  slotBtnActive: {
    borderColor: PINK,
    backgroundColor: '#FFF0F4',
  },
  slotBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  slotBtnTextActive: {
    color: PINK,
    fontWeight: '700',
  },
  moreSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  moreSlotsText: {
    fontSize: 14,
    fontWeight: '600',
    color: PINK,
  },
  bottomArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cancelNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  confirmBtn: {
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#FFB3CA',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  sheetSub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  sheetItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sheetItemImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  sheetItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    lineHeight: 18,
  },
  sheetItemQty: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
