import fs from "node:fs";
import mongoose from "mongoose";

// Safely load environment variables from .env.local or .env if present
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile);
      break;
    } catch {
      // ignore
    }
  }
}

const { MongoClient } = mongoose.mongo;

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017";
const LOCAL_DB_NAME = process.env.LOCAL_DB_NAME || "clothing_brand";

const ATLAS_URI = process.env.ATLAS_URI || process.env.MONGODB_URI;
if (!ATLAS_URI) {
  console.error("❌ ERROR: Neither ATLAS_URI nor MONGODB_URI is set in environment variables or .env.local!");
  process.exit(1);
}

// Extract database name from URI if present, or fallback to environment variable
const extractDbName = (uri, fallback) => {
  try {
    const parsed = new URL(uri);
    const db = parsed.pathname.replace(/^\//, "").split("?")[0];
    return db || fallback;
  } catch {
    return fallback;
  }
};

const ATLAS_DB_NAME = process.env.ATLAS_DB_NAME || extractDbName(ATLAS_URI, "izhaan");

async function migrate() {
  console.log("=== MongoDB Migration: Local -> Atlas ===");
  console.log(`Source: ${LOCAL_URI} [${LOCAL_DB_NAME}]`);
  console.log(`Target: MongoDB Atlas [${ATLAS_DB_NAME}]`);

  const localClient = new MongoClient(LOCAL_URI);
  const atlasClient = new MongoClient(ATLAS_URI);

  try {
    console.log("\nConnecting to Local MongoDB...");
    await localClient.connect();
    console.log("Connected to Local MongoDB.");

    console.log("Connecting to MongoDB Atlas...");
    await atlasClient.connect();
    console.log("Connected to MongoDB Atlas.");

    const localDb = localClient.db(LOCAL_DB_NAME);
    const atlasDb = atlasClient.db(ATLAS_DB_NAME);

    const collections = await localDb.listCollections().toArray();
    console.log(`\nFound ${collections.length} collection(s) in local '${LOCAL_DB_NAME}':`);
    collections.forEach((c) => console.log(` - ${c.name}`));

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith("system.")) continue;

      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);

      const localCount = await localCol.countDocuments();
      console.log(`\n-----------------------------------------`);
      console.log(`[${colName}] Local document count: ${localCount}`);

      const localDocs = await localCol.find({}).toArray();
      const localIds = localDocs.map((d) => d._id);

      // Clean up orphaned/duplicate documents in Atlas that do not exist in local
      const deleteResult = await atlasCol.deleteMany({
        _id: { $nin: localIds },
      });
      if (deleteResult.deletedCount > 0) {
        console.log(`[${colName}] Removed ${deleteResult.deletedCount} outdated/duplicate documents from Atlas.`);
      }

      if (localDocs.length > 0) {
        const batchSize = 500;
        let processed = 0;

        for (let i = 0; i < localDocs.length; i += batchSize) {
          const batch = localDocs.slice(i, i + batchSize);
          const operations = batch.map((doc) => ({
            replaceOne: {
              filter: { _id: doc._id },
              replacement: doc,
              upsert: true,
            },
          }));

          await atlasCol.bulkWrite(operations);
          processed += batch.length;
          console.log(`[${colName}] Upserted ${processed}/${localDocs.length} documents to Atlas.`);
        }
      }

      // Recreate Indexes
      try {
        const indexes = await localCol.indexes();
        for (const idx of indexes) {
          if (idx.name === "_id_") continue;
          const { key, name, unique, sparse, expireAfterSeconds, weights } = idx;
          const options = { name };
          if (unique) options.unique = true;
          if (sparse) options.sparse = true;
          if (expireAfterSeconds !== undefined) options.expireAfterSeconds = expireAfterSeconds;

          try {
            if (key._fts === "text" && weights) {
              const textKey = {};
              for (const field of Object.keys(weights)) {
                textKey[field] = "text";
              }
              await atlasCol.createIndex(textKey, options);
              console.log(`[${colName}] Created text index: ${name}`);
            } else {
              await atlasCol.createIndex(key, options);
              console.log(`[${colName}] Recreated index: ${name}`);
            }
          } catch (idxErr) {
            console.warn(`[${colName}] Notice on index ${name}: ${idxErr.message}`);
          }
        }
      } catch (err) {
        console.warn(`[${colName}] Could not copy indexes: ${err.message}`);
      }

      const atlasFinalCount = await atlasCol.countDocuments();
      console.log(`[${colName}] Synchronized! Local: ${localCount} | Atlas: ${atlasFinalCount}`);
    }

    console.log("\n=========================================");
    console.log("Migration & Synchronization Finished Successfully!");
    console.log("=========================================\n");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await localClient.close();
    await atlasClient.close();
    console.log("Connections closed.");
  }
}

migrate();
