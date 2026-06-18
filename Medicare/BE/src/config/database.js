const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

let memoryServer = null;

const shouldUseMemoryDb = () =>
  process.env.USE_IN_MEMORY_DB === 'true'
  || (process.env.NODE_ENV !== 'production' && process.env.USE_IN_MEMORY_DB !== 'false');

const startMemoryServer = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
};

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare_ai';

  if (shouldUseMemoryDb()) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️  Local MongoDB unavailable (${error.message})`);
      console.warn('↪ Starting in-memory MongoDB for development...');
      uri = await startMemoryServer();
    }
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.error('💡 Cài MongoDB local hoặc đặt MONGODB_URI (MongoDB Atlas) trong .env');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (memoryServer) await memoryServer.stop();
  process.exit(0);
});

module.exports = connectDB;
