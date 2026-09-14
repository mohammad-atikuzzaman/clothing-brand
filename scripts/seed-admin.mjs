import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";

// Load .env.local safely
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    try {
      if (typeof process.loadEnvFile === "function") {
        process.loadEnvFile(envFile);
      } else {
        const envContent = fs.readFileSync(envFile, "utf8");
        envContent.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const idx = trimmed.indexOf("=");
            if (idx !== -1) {
              const key = trimmed.substring(0, idx).trim();
              const val = trimmed.substring(idx + 1).trim();
              if (!process.env[key]) process.env[key] = val;
            }
          }
        });
      }
      break;
    } catch {
      // ignore
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not set in environment variables or .env.local!");
  process.exit(1);
}

const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error("❌ ERROR: Both INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be defined in .env.local!");
  process.exit(1);
}

async function run() {
  console.log("Connecting to MongoDB at", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const usersCol = db.collection("users");

  const existing = await usersCol.findOne({ email: adminEmail.toLowerCase() });
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  if (existing) {
    await usersCol.updateOne(
      { _id: existing._id },
      {
        $set: {
          role: "admin",
          password: hashedPassword,
          isBanned: false,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`Admin user ${adminEmail} updated with role: 'admin' and fresh password.`);
  } else {
    await usersCol.insertOne({
      name: "Izhaan Super Admin",
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      phone: "+880 1888-299388",
      isBanned: false,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Admin user ${adminEmail} created successfully.`);
  }

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
