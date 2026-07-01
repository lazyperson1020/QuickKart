const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const XLSX = require("xlsx");

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const fcm = getMessaging();

const workbook = XLSX.readFile("./data/catalog.xlsx");

async function syncProducts() {
  const sheetNames = workbook.SheetNames;

  for (const category of sheetNames) {
    const worksheet = workbook.Sheets[category];
    const products = XLSX.utils.sheet_to_json(worksheet);
    const subCollectionName = `${category}Collection`;

    console.log(`Syncing ${category}`);

    for (const product of products) {
      
      const normalizedProduct = {
        sku: product.sku ? String(product.sku).trim() : "",
        name: product.name ? String(product.name).trim() : "",
        price: product.price !== undefined ? Number(product.price) : 0,
        originalPrice: product.originalPrice !== undefined ? Number(product.originalPrice) : 0,
        stock: product.stock !== undefined ? Number(product.stock) : 0,
        weight: product.weight ? String(product.weight).trim() : "",
        imageUrl: product.imageUrl ? String(product.imageUrl).trim() : "",
        imageUrl1: product.imageUrl1 ? String(product.imageUrl1).trim() : "",
        imageUrl2: product.imageUrl2 ? String(product.imageUrl2).trim() : "",
        position: product.position !== undefined ? Number(product.position) : 0,
        brand: product.brand ? String(product.brand).trim() : "Generic",
        subCategory: product.subCategory ? String(product.subCategory).trim() : "",
        description: product.description ? String(product.description).trim() : "",
      };

      const existing = await db
        .collection("products")
        .doc(category)
        .collection(subCollectionName)
        .where("sku", "==", normalizedProduct.sku)
        .get();

      if (!existing.empty) {
        const docId = existing.docs[0].id;
        const existingData = existing.docs[0].data();

        // Detect restock: stock was 0, now positive — broadcast to FCM topic
        if (existingData.stock === 0 && normalizedProduct.stock > 0) {
          const productPayload = JSON.stringify({ id: docId, ...normalizedProduct });
          try {
            await fcm.send({
              topic: `stock_update_${normalizedProduct.sku}`,
              notification: {
                title: "Back in Stock! 🎉",
                body: `${normalizedProduct.name} is now available. Order before it sells out!`,
              },
              data: {
                type: "stock",
                sku: normalizedProduct.sku,
                category,
                productJson: productPayload,
              },
              android: {
                notification: { channelId: "stock" },
                priority: "high",
              },
            });
            console.log(`Sent restock notification for ${normalizedProduct.sku}`);
          } catch (err) {
            console.warn(`FCM send failed for ${normalizedProduct.sku}:`, err.message);
          }
        }

        await db
          .collection("products")
          .doc(category)
          .collection(subCollectionName)
          .doc(docId)
          .update(normalizedProduct);

        console.log(`Updated ${normalizedProduct.sku}`);
      } else {
        await db
          .collection("products")
          .doc(category)
          .collection(subCollectionName)
          .add(normalizedProduct);

        console.log(`Inserted ${normalizedProduct.sku}`);
      }
    }
  }
  console.log("All products synced successfully.");
}

syncProducts();