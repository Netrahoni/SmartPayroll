import mongoose from 'mongoose';

// Your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/smartpayroll';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
