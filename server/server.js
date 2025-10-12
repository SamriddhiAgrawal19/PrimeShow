import express from "express";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import cors from "cors";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import { inngest, functions } from "./ingest/index.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config(); 

const app = express();
const port = 3000;


await connectDB();


app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
    signingKey: process.env.INGEST_SIGNING_KEYS,
  })
);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("Database Connected to Atlas");
  
});
