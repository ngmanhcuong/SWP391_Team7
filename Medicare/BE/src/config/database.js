const dns = require('dns');
const mongoose = require('mongoose');

// Một số mạng/DNS trên Windows từ chối SRV lookup của mongodb+srv://
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
 
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});
 
module.exports = connectDB;
