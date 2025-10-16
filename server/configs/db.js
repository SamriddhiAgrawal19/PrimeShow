import mongoose from "mongoose";
import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const seedUsers = async () => {
  try {
    const users = await clerkClient.users.getUserList({ limit: 100 });
    for (const u of users) {
      const userData = {
        _id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.emailAddresses[0].emailAddress,
        image: u.imageUrl, // use imageUrl, profileImageUrl is deprecated
      };
      await User.updateOne({ _id: u.id }, userData, { upsert: true });
      console.log("User synced:", u.id);
    }
  } catch (err) {
    console.error("Error syncing users:", err);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ Database Connected to Atlas: ${conn.connection.name} at ${conn.connection.host}`
    );

    // Seed users first
    await seedUsers();

    const moviesCount = await mongoose.connection.db
      .collection("movies")
      .countDocuments();
    const showsCount = await mongoose.connection.db
      .collection("shows")
      .countDocuments();
    const bookingsCount = await mongoose.connection.db
      .collection("bookings")
      .countDocuments();
    const usersCount = await mongoose.connection.db
      .collection("users")
      .countDocuments();

    console.log(`Movies in DB: ${moviesCount}`);
    console.log(`Shows in DB: ${showsCount}`);
    console.log(`Bookings in DB: ${bookingsCount}`);
    console.log(`Users in DB: ${usersCount}`);
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
