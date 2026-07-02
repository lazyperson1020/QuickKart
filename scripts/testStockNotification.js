/**
 * One-shot FCM test — sends a restock notification directly to a topic.
 * Does NOT touch Firestore or the Excel sheet.
 *
 * Usage:
 *   node scripts/testStockNotification.js <SKU> [category]
 *
 * Example:
 *   node scripts/testStockNotification.js APPLE-001 Fruits
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });

const fcm = getMessaging();

const sku = process.argv[2];
const category = process.argv[3] || "General";

if (!sku) {
  console.error("Usage: node scripts/testStockNotification.js <SKU> [category]");
  process.exit(1);
}

// Minimal product payload — enough for ProductDetails to render
const productJson = JSON.stringify({
  id: `test-${sku}`,
  sku,
  name: `Test Product (${sku})`,
  price: 99,
  originalPrice: 120,
  stock: 10,
  weight: "500g",
  imageUrl: "",
  position: 1,
  brand: "Test Brand",
  subCategory: "Test",
});

fcm
  .send({
    topic: `stock_update_${sku}`,
    notification: {
      title: "Back in Stock! 🎉",
      body: `Test Product (${sku}) is now available. Order before it sells out!`,
    },
    data: {
      type: "stock",
      sku,
      category,
      productJson,
    },
    android: {
      notification: { channelId: "stock" },
      priority: "high",
    },
  })
  .then((msgId) => console.log(`✓ Sent to topic stock_update_${sku}  [${msgId}]`))
  .catch((err) => console.error("✗ FCM error:", err.message));
