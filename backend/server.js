import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 10000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
import cors from "cors";

app.use(cors({
  origin: ["https://qr-saas-frontend.vercel.app"],
  credentials: true
}));
