const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

// When a product's stock goes from 0 → >0, notify all subscribers via FCM
exports.notifyStockAvailable = onDocumentUpdated(
  'products/{category}/{collection}/{productId}',
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const { productId } = event.params;

    const wasOutOfStock = before.stock <= 0;
    const isNowInStock = after.stock > 0;
    if (!wasOutOfStock || !isNowInStock) return;

    const subscribersSnap = await admin
      .firestore()
      .collection('notifyWhenInStock')
      .doc(productId)
      .collection('subscribers')
      .get();

    if (subscribersSnap.empty) return;

    const productName = after.name || 'A product you wanted';

    const tokens = subscribersSnap.docs
      .map((d) => d.data().fcmToken)
      .filter(Boolean);

    if (tokens.length === 0) return;

    // Send in batches of 500 (FCM limit)
    const chunkSize = 500;
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        notification: {
          title: 'Back in Stock!',
          body: `${productName} is now available. Grab it before it sells out!`,
        },
        data: { type: 'stock', productId, category: event.params.category, sku: after.sku || productId },
        android: { priority: 'high' },
      });
    }

    // Remove subscribers so they must opt-in again next time stock drops
    const batch = admin.firestore().batch();
    subscribersSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
);

// When an order is created, send FCM to the user (for background/killed app state)
exports.notifyOrderPlaced = onDocumentCreated(
  'orders/{orderId}',
  async (event) => {
    const order = event.data.data();
    const { userId, total } = order;
    if (!userId) return;

    const userSnap = await admin.firestore().collection('users').doc(userId).get();
    const fcmToken = userSnap.data()?.fcmToken;
    if (!fcmToken) return;

    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: 'Order Placed!',
        body: `Your order of ₹${total} has been placed. We'll deliver soon!`,
      },
      data: { type: 'order', orderId: event.params.orderId },
      android: { priority: 'high' },
    });
  }
);
