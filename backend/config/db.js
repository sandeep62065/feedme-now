import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedOnStartup } from './seedOnStartup.js';

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    // If no URI or we are in development and want auto-fallback
    if (!dbUrl || dbUrl.includes('127.0.0.1') || dbUrl.includes('localhost')) {
      try {
        console.log('Attempting connection to local MongoDB instance...');
        // Set serverSelectionTimeoutMS low so it fails quickly if local MongoDB is not running
        await mongoose.connect(dbUrl || 'mongodb://127.0.0.1:27017/freshbite', { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB Connected to local service.');
      } catch (err) {
        console.log('Local MongoDB service is not running. Launching In-Memory MongoDB Server...');
        mongod = await MongoMemoryServer.create({ binary: { version: '6.0.8' } });
        dbUrl = mongod.getUri();
        await mongoose.connect(dbUrl);
        console.log(`In-Memory MongoDB Server Connected: ${dbUrl}`);
      }
    } else {
      const conn = await mongoose.connect(dbUrl);
      console.log(`MongoDB Connected to cloud service: ${conn.connection.host}`);
    }

    // Run auto-seeding if empty
    await seedOnStartup();

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting from database:', err);
  }
};

export default connectDB;
