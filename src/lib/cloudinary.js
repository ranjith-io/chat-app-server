import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
// console.log(process.env.cloudinary_cloud_name)
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
    });

export default cloudinary;