import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn=await mongoose.connect(process.env.mongo_url);
        // console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log('Database connected'+conn.connection.host);
    }
    catch (error){
        console.log('MongoDB connection failed',error);
    }
    
};