/**
 * ShareProductSheet — self-contained QR share modal.
 *
 * TO REMOVE THIS FEATURE LATER:
 *   1. Delete this file.
 *   2. In ProductDetailsScreen.tsx, remove the import, the shareVisible state,
 *      and the <ShareProductSheet /> JSX tag. That's it — nothing else breaks.
 */

import React, { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { useTranslation } from '../localization/LanguageContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productPrice: number;
  category?: string;
}

export default function ShareProductSheet({
  visible,
  onClose,
  productId,
  productName,
  productPrice,
  category,
}: Props) {
  const { t } = useTranslation();
  const viewShotRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = React.useState(false);

  const deepLink = category
    ? `quickkart://product/${encodeURIComponent(productId)}?category=${encodeURIComponent(category)}`
    : `quickkart://product/${encodeURIComponent(productId)}`;

  const handleShareQR = async () => {
    if (!viewShotRef.current) return;
    setSharing(true);
    try {
      const uri = await (viewShotRef.current as any).capture();
      await Share.open({
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/png',
        message: t.shareProduct.shareMessage(productName, productPrice),
        failOnCancel: false,
      });
    } catch {
      // user dismissed
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.title}>{t.shareProduct.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{productName}</Text>
        <Text style={styles.price}>{t.shareProduct.priceLabel(productPrice)}</Text>

        {/* QR code card — this is what gets captured and shared as image */}
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.qrCard}>
          <QRCode value={deepLink} size={180} />
          <Text style={styles.qrLabel}>{t.shareProduct.scanToOpen}</Text>
          <Text style={styles.qrProductName} numberOfLines={2}>{productName}</Text>
        </ViewShot>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShareQR}
          disabled={sharing}
        >
          {sharing
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.shareBtnText}>{t.shareProduct.shareQrCode}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>{t.common.cancel}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 20,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 12,
  },
  qrProductName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 200,
  },
  shareBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#888',
  },
});
