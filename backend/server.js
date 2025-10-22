import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check (handy on Render)
app.get("/health", (req, res) => res.json({ ok: true }));

// TODO: keep your existing routes here, e.g.
// import creationsRouter from "./routes/creations.js";
// app.use("/api/creations", creationsRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
