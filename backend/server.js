import express from "express";
import dotenv from "dotenv";
import { sql } from "./src/config/db.js";
import rateLimiting from "./src/middleware/rateLimiting.js";
import transactionsRoute from "./src/routes/transactionsRoute.js";

dotenv.config();
const app = express();

// middleware
app.use(rateLimiting);
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize DB and create table if not exists
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing the DB:", error);
    process.exit(1);
  }
}

// Routes
app.use("/api/transactions", transactionsRoute);

// Health check endpoint
app.get("/healthycheck", (req, res) => {
  res.status(200).json({ message: "✅ API is working perfectly fine" });
});

// Start server after DB initialization
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
  });
});
