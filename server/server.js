import express from "express";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import cors from "cors";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import { inngest, functions } from "./ingest/index.js";
import { clerkMiddleware, clerkClient } from "@clerk/express";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import AdminRouter from "./routes/AdminRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

console.log("TMDB API Key:", process.env.TMDB_API_KEY)

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ connect to DB first
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected to Atlas");

    // all routes
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use("/api/shows", showRouter);
    app.use("/api/booking", bookingRouter);
    app.use("/api/admin", AdminRouter);
    app.use("/api/user", userRouter);
    app.use(
      "/api/inngest",
      serve({
        client: inngest,
        functions,
        signingKey: process.env.INGEST_SIGNING_KEYS,
      })
    );

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
