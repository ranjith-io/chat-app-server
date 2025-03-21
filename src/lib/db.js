import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log('MongoDatabase connected!');
    }
    catch (error){
        console.log('MongoDB connection failed',error);
    }
    
};