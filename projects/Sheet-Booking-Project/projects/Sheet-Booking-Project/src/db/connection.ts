import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/show-booking';

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        const maskedUri = MONGODB_URI.split('@')[1] || MONGODB_URI;
        console.log(`URI (masked): ${maskedUri}`);

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        console.log('Tip: Check your IP whitelisting in MongoDB Atlas and ensure the cluster is not paused.');
    }
};
