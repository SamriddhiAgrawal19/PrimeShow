import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ Database Connected to Atlas: ${conn.connection.name} at ${conn.connection.host}`
    );

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
