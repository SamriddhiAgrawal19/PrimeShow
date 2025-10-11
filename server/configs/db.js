import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database Connected to Atlas');
  } catch (error) {
    console.error('Database Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
