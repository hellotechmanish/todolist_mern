import mongoose from 'mongoose';

const connectDB = async (mongoUri: string) => {
  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
